import { Request, Response } from 'express';
import { ratingModel } from '../models/ratingModel';
import { AuthenticatedRequest } from 'types/expressTypes';

// Create a new rating
export const createRating = async (req: AuthenticatedRequest, res: Response) => {
    try {
        const { targetType, targetId, rater, score, comment } = req.body;

        if (!targetType || !targetId || !score) {
            res.status(400).json({ message: 'targetType, targetId, and score are required.' });
            return;
        }

        const newRating = new ratingModel({
        targetType,
        targetId,
        rater: rater || req.userDb?._id, // fallback to logged-in user
        score,
        comment,
        });

        await newRating.save();

        res.status(201).json(newRating);
    } catch (error) {
        console.error('Error creating rating:', error);
        res.status(500).json({ status: 'error', message: 'Failed to create rating' });
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
