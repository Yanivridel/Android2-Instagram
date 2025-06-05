import { Request, Response } from 'express';
import { ratingModel } from '../models/ratingModel';
import { AuthenticatedRequest } from 'types/expressTypes';
import { userModel } from 'models/userModel';
import { postModel } from 'models/postModel';
import { commentModel } from 'models/commentModel';
import mongoose from 'mongoose';

// Help Functions
export const recalculateUserRating = async (userId: mongoose.Types.ObjectId) => {
    const [userRatings, postRatings, commentRatings] = await Promise.all([
        ratingModel.find({ targetType: 'User', targetId: userId }),
        ratingModel.find({ targetType: 'Post' }),
        ratingModel.find({ targetType: 'Comment' }),
    ]);

    const [userPosts, userComments] = await Promise.all([
        postModel.find({ author: userId }, '_id'),
        commentModel.find({ author: userId }, '_id'),
    ]);

    const postIds = userPosts.map(p => p._id.toString());
    const commentIds = userComments.map(c => c._id.toString());

    const userPostRatings = postRatings.filter(r => postIds.includes(r.targetId.toString()));
    const userCommentRatings = commentRatings.filter(r => commentIds.includes(r.targetId.toString()));

    const hasUserRatings = userRatings.length > 0;
    const hasPostRatings = userPostRatings.length > 0;
    const hasCommentRatings = userCommentRatings.length > 0;

    const totalRatings = userRatings.length + userPostRatings.length + userCommentRatings.length;
    if (totalRatings === 0) {
        await userModel.findByIdAndUpdate(userId, {
            'ratingStats.averageScore': 2.5,
            'ratingStats.totalRatings': 0,
        });
        return;
    }

    // 1. Define intended weights
    const weights = {
        user: 0.5,
        post: 0.35,
        comment: 0.15,
    };

    // 2. Filter only present categories
    const presentWeights: { [key: string]: number } = {};
    if (hasUserRatings) presentWeights.user = weights.user;
    if (hasPostRatings) presentWeights.post = weights.post;
    if (hasCommentRatings) presentWeights.comment = weights.comment;

    // 3. Normalize the present weights
    const totalWeight = Object.values(presentWeights).reduce((a, b) => a + b, 0);
    for (const key in presentWeights) {
        presentWeights[key] /= totalWeight;
    }

    // 4. Compute weighted average
    const avg = (ratings: typeof userRatings) =>
        ratings.reduce((sum, r) => sum + r.rating, 0) / (ratings.length || 1);

    const weightedSum =
        (hasUserRatings ? avg(userRatings) * presentWeights.user : 0) +
        (hasPostRatings ? avg(userPostRatings) * presentWeights.post : 0) +
        (hasCommentRatings ? avg(userCommentRatings) * presentWeights.comment : 0);

    const averageScore = parseFloat(weightedSum.toFixed(2));

    await userModel.findByIdAndUpdate(userId, {
        'ratingStats.averageScore': averageScore,
        'ratingStats.totalRatings': totalRatings,
    });
};

// Create a new rating
export const createRating = async (req: AuthenticatedRequest, res: Response) => {
    try {
        const { targetType, targetId, rating } = req.body;
        const rater = req.userDb?._id;

        if (!targetType || !targetId || !rating) {
            res.status(400).json({ message: 'targetType, targetId, and score are required.' });
            return;
        }

        const newRating = new ratingModel({
            targetType,
            targetId,
            rater,
            rating,
        });

        await newRating.save();

        // Determine the user to update
        let userToUpdate: mongoose.Types.ObjectId | null = null;

        if (targetType === 'User') {
            userToUpdate = targetId;
        } else if (targetType === 'Post') {
            const post = await postModel.findById(targetId);
            if (post) userToUpdate = post.author;
        } else if (targetType === 'Comment') {
            const comment = await commentModel.findById(targetId);
            if (comment) userToUpdate = comment.author;
        }

        if (userToUpdate) {
            await recalculateUserRating(userToUpdate);
        }

        res.status(201).json(newRating);
    } catch (error) {
        console.error('Error creating rating:', error);
        res.status(500).json({ message: 'Failed to create rating' });
    }
};

// Get all ratings for a specific target (user/post/comment)
export const getRatingsByTarget = async (req: AuthenticatedRequest, res: Response) => {
    try {
        const { targetType, targetId } = req.query;

        if (!targetType || !targetId) {
            res.status(400).json({ message: 'targetType and targetId query parameters are required.' });
            return;
        }

        const ratings = await ratingModel.find({
        targetType,
        targetId,
        }).populate('rater', 'username'); // populate rater username (optional)

        res.status(200).json(ratings);
    } catch (error) {
        console.error('Error fetching ratings:', error);
        res.status(500).json({ status: 'error', message: 'Failed to fetch ratings' });
    }
};

// Get average rating for a specific target
export const getAverageRatingForTarget = async (req: AuthenticatedRequest, res: Response) => {
    try {
        const { targetType, targetId } = req.query;

        if (!targetType || !targetId) {
            res.status(400).json({ message: 'targetType and targetId query parameters are required.' });
            return;
        }

        const result = await ratingModel.aggregate([
        { $match: { targetType, targetId } },
        { $group: { _id: null, averageScore: { $avg: '$score' }, count: { $sum: 1 } } }
        ]);

        const averageScore = result[0]?.averageScore || 0;
        const count = result[0]?.count || 0;

        res.status(200).json({ averageScore, count });
    } catch (error) {
        console.error('Error getting average rating:', error);
        res.status(500).json({ status: 'error', message: 'Failed to get average rating' });
    }
};

// Update a rating by ID
export const updateRating = async (req: AuthenticatedRequest, res: Response) => {
    try {
        const { ratingId } = req.params;
        const { score } = req.body;

        if (!score) {
            res.status(400).json({ message: 'At least one of score or comment must be provided to update.' });
            return;
        }

        const rating = await ratingModel.findById(ratingId);

        if (!rating) {
            res.status(404).json({ message: 'Rating not found' });
            return;
        }

        // Optionally check if current user is the rater (authorization)
        if (rating.rater.toString() !== req.userDb?._id?.toString()) {
            res.status(403).json({ message: 'You are not authorized to update this rating' });
            return;
        }

        if (score !== undefined) rating.rating = score;

        await rating.save();

        res.status(200).json(rating);
    } catch (error) {
        console.error('Error updating rating:', error);
        res.status(500).json({ status: 'error', message: 'Failed to update rating' });
    }
};

// Delete a rating by ID
export const deleteRating = async (req: AuthenticatedRequest, res: Response) => {
    try {
        const { ratingId } = req.params;

        const rating = await ratingModel.findById(ratingId);

        if (!rating) {
            res.status(404).json({ message: 'Rating not found' });
            return;
        }

        // Optionally check if current user is the rater (authorization)
        if (rating.rater.toString() !== req.userDb?._id?.toString()) {
            res.status(403).json({ message: 'You are not authorized to delete this rating' });
            return;
        }

        await rating.deleteOne();

        res.status(200).json({ message: 'Rating deleted successfully' });
    } catch (error) {
        console.error('Error deleting rating:', error);
        res.status(500).json({ status: 'error', message: 'Failed to delete rating' });
    }
};

// Get top 10 rated targets across the app
    export const getTop10Ratings = async (_req: AuthenticatedRequest, res: Response) => {
    try {
        // Aggregate average scores grouped by targetType & targetId, sorted descending
        const topRatings = await ratingModel.aggregate([
        {
            $group: {
            _id: { targetType: "$targetType", targetId: "$targetId" },
            averageScore: { $avg: "$score" },
            count: { $sum: 1 }
            }
        },
        { $sort: { averageScore: -1, count: -1 } },
        { $limit: 10 }
        ]);

        res.status(200).json(topRatings);
    } catch (error) {
        console.error('Error getting top ratings:', error);
        res.status(500).json({ status: 'error', message: 'Failed to get top ratings' });
    }
};
