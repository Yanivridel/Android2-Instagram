// models/ratingModel.ts
import mongoose, { Schema, model } from 'mongoose';
import { IRating } from 'types/ratingTypes';

const ratingSchema = new Schema<IRating>({
    rater: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    targetType: { type: String, enum: ['User', 'Post', 'Comment'], required: true },
    targetId: { type: Schema.Types.ObjectId, required: true, index: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
}, { timestamps: true });

export const ratingModel = model<IRating>('Rating', ratingSchema);
