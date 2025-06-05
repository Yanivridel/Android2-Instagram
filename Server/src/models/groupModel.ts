import { Schema, model } from 'mongoose';
import { IGroup } from 'types/groupTypes';

const groupSchema = new Schema<IGroup>({
    name: { type: String, required: true, trim: true },
    description: { type: String, default: '' },
    members: [{ type: Schema.Types.ObjectId, ref: 'User', default: [] }],
    managers: [{ type: Schema.Types.ObjectId, ref: 'User', default: [] }],
    createdAt: { type: Date, default: Date.now },
}, {
    timestamps: true,
});

export const groupModel = model<IGroup>('Group', groupSchema);