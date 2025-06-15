import { Request, Response } from 'express';
import { groupModel } from '../models/groupModel';
import mongoose, { Types } from 'mongoose';
import { postModel } from 'models/postModel';
import { AuthenticatedRequest } from 'types/expressTypes';

export const createGroup = async (req: Request, res: Response) => {
    const {
        name,
        groupPicture,
        description,
        members,
        managers,
        ratingLimit
    } = req.body;

    // Simple validations
    if (!name || typeof name !== 'string') {
        res.status(400).json({ error: 'Group name is required and must be a string.' });
        return;
    }

    if (groupPicture && typeof groupPicture !== 'string') {
        res.status(400).json({ error: 'Group picture must be a valid URL string.' });
        return;
    }

    if (description && typeof description !== 'string') {
        res.status(400).json({ error: 'Description must be a string.' });
        return;
    }

    if (members && !Array.isArray(members)) {
        res.status(400).json({ error: 'Members must be an array of user IDs.' });
        return;
    }

    if (managers && !Array.isArray(managers)) {
        res.status(400).json({ error: 'Managers must be an array of user IDs.' });
        return;
    }

    if (ratingLimit !== undefined && (typeof ratingLimit !== 'number' || ratingLimit < 0)) {
        res.status(400).json({ error: 'Rating limit must be a non-negative number.' });
        return;
    }

    // Optionally validate that ObjectIds are valid
    const validateObjectIds = (ids: string[]) =>
        ids.every(id => mongoose.Types.ObjectId.isValid(id));

    if (members && !validateObjectIds(members)) {
        res.status(400).json({ error: 'Some member IDs are not valid ObjectIds.' });
        return;
    }

    if (managers && !validateObjectIds(managers)) {
        res.status(400).json({ error: 'Some manager IDs are not valid ObjectIds.' });
        return;
    }

    try {
        const group = await groupModel.create({
            name,
            groupPicture,
            description,
            members,
            managers,
            ratingLimit
        });

        res.status(201).json(group);
    } catch (error) {
        console.error("Group creation error:", error);
        res.status(500).json({ error: "Failed to create group." });
    }
};

// Get all groups
export const getGroups = async (_req: Request, res: Response) => {
    try {
        const groups = await groupModel.find().populate('members managers');
        res.status(200).json(groups);
        return;
    } catch (error) {
        console.error("Error fetching groups:", error);
        res.status(500).json({ error: "Failed to fetch groups." });
        return;
    }
};

// Get group by ID
export const getGroupById = async (req: Request, res: Response) => {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        res.status(400).json({ error: 'Invalid group ID.' });
        return;
    }

    try {
        const group = await groupModel.findById(id).populate('members managers');

        if (!group) {
            res.status(404).json({ error: 'Group not found.' });
            return;
        }

        res.status(200).json(group);
        return;
    } catch (error) {
        console.error("Error fetching group by ID:", error);
        res.status(500).json({ error: "Failed to fetch group by ID." });
        return;
    }
};

// Update group by ID
export const updateGroup = async (req: Request, res: Response) => {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        res.status(400).json({ error: 'Invalid group ID.' });
        return;
    }

    try {
        const group = await groupModel.findByIdAndUpdate(id, req.body, {
            new: true,
            runValidators: true
        });

        if (!group) {
            res.status(404).json({ error: 'Group not found.' });
            return;
        }

        res.status(200).json(group);
        return;
    } catch (error) {
        console.error("Error updating group:", error);
        res.status(400).json({ error: "Failed to update group." });
        return;
    }
};

// Delete group by ID
export const deleteGroup = async (req: Request, res: Response) => {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        res.status(400).json({ error: 'Invalid group ID.' });
        return;
    }

    try {
        const group = await groupModel.findByIdAndDelete(id);

        if (!group) {
            res.status(404).json({ error: 'Group not found.' });
            return;
        }

        res.status(200).json({ message: 'Group deleted successfully.' });
        return;
    } catch (error) {
        console.error("Error deleting group:", error);
        res.status(500).json({ error: "Failed to delete group." });
        return;
    }
};

export const getPostsByGroupId = async (req: Request, res: Response) => {
	try {
		const { groupId } = req.params;

		if (!groupId) {
			res.status(400).json({ error: 'Group ID is required' });
			return;
		}

		const posts = await postModel
			.find({ group: groupId })
			.populate('author', 'username profileImage')
			.sort({ createdAt: -1 });

		res.status(200).json(posts);
	} catch (error) {
		console.error('Error fetching posts by group ID:', error);
		res.status(500).json({ error: 'Failed to get posts by group ID' });
	}
};

export const joinGroup = async (req: AuthenticatedRequest, res: Response) => {
	try {
		const { groupId } = req.params;
        const userId = new Types.ObjectId(String(req.userDb?._id));

		if (!groupId || !userId) {
			res.status(400).json({ error: 'Group ID and User ID are required' });
			return;
		}

		const group = await groupModel.findById(groupId);

		if (!group) {
			res.status(404).json({ error: 'Group not found' });
			return;
		}

		if (group.members.some((id => id.toString() === userId.toString()))) {
			res.status(400).json({ error: 'User already a member of this group' });
			return;
		}

		group.members.push(userId);
		await group.save();

		res.status(200).json({ message: 'Joined group successfully', group });
	} catch (error) {
		console.error('Error joining group:', error);
		res.status(500).json({ error: 'Failed to join group' });
	}
};

export const leaveGroup = async (req: AuthenticatedRequest, res: Response) => {
	try {
		const { groupId } = req.params;
        const userId = new Types.ObjectId(String(req.userDb?._id));

		if (!groupId || !userId) {
			res.status(400).json({ error: 'Group ID and User ID are required' });
			return;
		}

		const group = await groupModel.findById(groupId);

		if (!group) {
			res.status(404).json({ error: 'Group not found' });
			return;
		}

		if (!group.members.includes(userId)) {
			res.status(400).json({ error: 'User is not a member of this group' });
			return;
		}

		group.members = group.members.filter(
			(memberId) => memberId.toString() !== userId.toString()
		);

		await group.save();

		res.status(200).json({ message: 'Left group successfully', group });
	} catch (error) {
		console.error('Error leaving group:', error);
		res.status(500).json({ error: 'Failed to leave group' });
	}
};

export const getMyGroups = async (req: AuthenticatedRequest, res: Response) => {
    try {
        const userId = req.userDb?._id;
        if (!userId) {
            res.status(401).json({ message: 'Unauthorized' });
            return;
        }

        const groups = await groupModel.find({ members: userId });
        res.status(200).json(groups);
    } catch (error) {
        console.error('Failed to fetch user groups:', error);
        res.status(500).json({ message: 'Failed to fetch user groups' });
    }
};