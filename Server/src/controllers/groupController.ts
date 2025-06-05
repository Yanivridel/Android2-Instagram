import { Request, Response } from 'express';
import { groupModel } from '../models/groupModel';

export const createGroup = async (req: Request, res: Response) => {
    try {
        const group = await groupModel.create(req.body);
        res.status(201).json(group);
    } catch (error) {
        res.status(400).json({ error: "Failed to create group" });
    }
};

export const getGroups = async (_req: Request, res: Response) => {
    try {
        const groups = await groupModel.find().populate('members managers');
        res.status(200).json(groups);
    } catch (error) {
        res.status(500).json({ error: "Failed to find groups" });
    }
};

export const getGroupById = async (req: Request, res: Response) => {
    try {
        const group = await groupModel.findById(req.params.id).populate('members managers');
        
        if (!group) {
            res.status(404).json({ error: 'Group not found' });
            return;
        }

        res.status(200).json(group);
    } catch (error) {
        res.status(500).json({ error: "Failed to get group by id" });
    }
};

export const updateGroup = async (req: Request, res: Response) => {
    try {
        const group = await groupModel.findByIdAndUpdate(req.params.id, req.body, { new: true });

        if (!group) { 
            res.status(404).json({ error: 'Group not found' });
            return;
        }

        res.status(200).json(group);
    } catch (error) {
        res.status(400).json({ error: "Failed to update group" });
    }
};

export const deleteGroup = async (req: Request, res: Response) => {
    try {
        const group = await groupModel.findByIdAndDelete(req.params.id);
        if (!group) {
            res.status(404).json({ error: 'Group not found' });
            return;
        }
        res.status(200).json({ message: 'Group deleted' });
    } catch (error) {
        res.status(500).json({ error: "Failed to delete group" });
    }
};