import { Request, Response } from 'express';
import { commentModel } from '../models/commentModel';
import { AuthenticatedRequest } from 'types/expressTypes';
import { postModel } from 'models/postModel';

export const createComment = async (req: AuthenticatedRequest, res: Response) => {
    try {
        const { content, postId, parentCommentId } = req.body;

        if (!content || !postId) {
            res.status(400).json({ message: 'Content and Post ID are required' });
            return;
        }

        const newComment = new commentModel({
            content,
            post: postId,
            author: req.userDb?._id,
            parentComment: parentCommentId || null,
        });

        await newComment.save();

        // Add to post root comments if it's a top-level comment
        if (!parentCommentId) {
            await postModel.findByIdAndUpdate(postId, {
                $push: { comments: newComment._id }
            });
        } else {
            // Otherwise, it's a reply to another comment
            await commentModel.findByIdAndUpdate(parentCommentId, {
                $push: { replies: newComment._id }
            });
        }

        const newPopulatedComment = await commentModel
            .findById(newComment._id)
            .populate('author', 'username profileImage ratingStats');

        res.status(201).json(newPopulatedComment);
    } catch (error) {
        console.error('Error creating comment:', error);
        res.status(500).json({ message: 'Failed to create comment' });
    }
};

export const getCommentById = async (req: Request, res: Response) => {
    try {
        const comment = await commentModel.findById(req.params.id)
            .populate('author', 'username email')
            .populate('post');

        if (!comment) {
            res.status(404).json({ message: 'Comment not found' });
            return;
        }

        res.status(200).json(comment);
    } catch (error) {
        console.error('Error fetching comment:', error);
        res.status(500).json({ message: 'Failed to fetch comment' });
    }
};

export const updateComment = async (req: AuthenticatedRequest, res: Response) => {
    try {
        const comment = await commentModel.findById(req.params.id);

        if (!comment) {
            res.status(404).json({ message: 'Comment not found' });
            return;
        }

        if (comment.author.toString() !== req.userDb?._id?.toString()) {
            res.status(403).json({ message: 'Unauthorized' });
            return;
        }

        comment.content = req.body.content || comment.content;
        comment.updatedAt = new Date();

        await comment.save();
        res.status(200).json(comment);
    } catch (error) {
        console.error('Error updating comment:', error);
        res.status(500).json({ message: 'Failed to update comment' });
    }
};

export const deleteComment = async (req: AuthenticatedRequest, res: Response) => {
    try {
        const comment = await commentModel.findById(req.params.id);

        if (!comment) {
            res.status(404).json({ message: 'Comment not found' });
            return;
        }

        if (comment.author.toString() !== req.userDb?._id?.toString()) {
            res.status(403).json({ message: 'Unauthorized' });
            return;
        }

        await commentModel.findByIdAndDelete(req.params.id);

        await postModel.findByIdAndUpdate(comment.post, {
            $pull: { comments: comment._id }
        });

        res.status(200).json({ message: 'Comment deleted successfully' });
    } catch (error) {
        console.error('Error deleting comment:', error);
        res.status(500).json({ message: 'Failed to delete comment' });
    }
};

export const getCommentsByPost = async (req: Request, res: Response) => {
    try {
        const { postId } = req.params;

        const comments = await commentModel.find({ post: postId })
            .populate('author', 'username profileImage ratingStats')
            .populate({
                path: 'replies',
                populate: {
                    path: 'author',
                    select: 'username profileImage ratingStats'
                }
            })
            .sort({ createdAt: 1 });

        res.status(200).json(comments);
    } catch (error) {
        console.error('Error fetching comments:', error);
        res.status(500).json({ message: 'Failed to fetch comments' });
    }
};
