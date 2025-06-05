import { Request, Response } from 'express';
import { userModel } from '../models/userModel';
import { postModel } from 'models/postModel';
import { MongoError } from 'mongodb';
import { AuthenticatedRequest } from 'types/expressTypes';
import { commentModel } from 'models/commentModel';

export const createPost = async (req: AuthenticatedRequest, res: Response) => {
    try {
        const { content, imageUrls, group, isPublic, locationString } = req.body;

        if (!content) {
            res.status(400).json({ message: "Content is required" });
            return;
        }

        const newPost = new postModel({
            content,
            imageUrls,
            group,
            isPublic,
            author: req.userDb?._id,
            locationString,
        });

        await newPost.save();
        res.status(201).json(newPost);
    } catch (error) {
        console.error('Error creating post:', error);
        res.status(500).json({ message: "Failed to create post" });
    }
};

export const getPostsByUser = async (req: AuthenticatedRequest, res: Response) => {
    try {
        const userId = req.params.userId;

        const posts = await postModel.find({ author: userId })
            .sort({ createdAt: -1 });

        res.status(200).json(posts);
    } catch (error) {
        console.error('Error fetching user posts:', error);
        res.status(500).json({ status: 'error', message: 'Failed to fetch posts by user' });
    }
};

export const getMyPosts = async (req: AuthenticatedRequest, res: Response) => {
    try {
        const posts = await postModel.find({ author: req.userDb?._id })
            .sort({ createdAt: -1 });

        res.status(200).json(posts);
    } catch (error) {
        console.error('Error fetching user posts:', error);
        res.status(500).json({ status: 'error', message: 'Failed to fetch your posts' });
    }
};

export const getPostById = async (req: Request, res: Response) => {
    try {
        const { postId } = req.params;

        const post = await postModel
            .findById(postId)
            .populate('author', 'username')
            // .populate('group', 'name')
            .populate('comments');

        if (!post) {
            res.status(404).json({ message: "Post not found" });
            return;
        }

        res.status(200).json(post);
    } catch (error) {
        console.error('Error fetching post:', error);
        res.status(500).json({ message: "Failed to fetch post" });
    }
};

export const updatePost = async (req: AuthenticatedRequest, res: Response) => {
    try {
        const { postId } = req.params;
        const { content, imageUrls, isPublic, locationString } = req.body;

        const post = await postModel.findById(postId);
        if (!post) {
            res.status(404).json({ message: "Post not found" });
            return;
        }

        if (post.author.toString() !== req.userDb?._id?.toString()) {
            res.status(403).json({ message: "Unauthorized to update this post" });
            return;
        }

        post.content = content ?? post.content;
        post.imageUrls = imageUrls ?? post.imageUrls;
        post.isPublic = isPublic ?? post.isPublic;
        post.locationString = locationString ?? post.locationString;
        post.updatedAt = new Date();

        await post.save();
        res.status(200).json(post);
    } catch (error) {
        console.error('Error updating post:', error);
        res.status(500).json({ message: "Failed to update post" });
    }
};

export const deletePost = async (req: AuthenticatedRequest, res: Response) => {
    try {
        const { postId } = req.params;

        const post = await postModel.findById(postId);
        if (!post) {
            res.status(404).json({ message: "Post not found" });
            return;
        }

        if (post.author.toString() !== req.userDb?._id?.toString()) {
            res.status(403).json({ message: "Unauthorized to delete this post" });
            return;
        }

        await commentModel.deleteMany({ _id: { $in: post.comments } });

        await post.deleteOne();
        res.status(200).json({ message: "Post deleted successfully" });
    } catch (error) {
        console.error('Error deleting post:', error);
        res.status(500).json({ message: "Failed to delete post" });
    }
};
