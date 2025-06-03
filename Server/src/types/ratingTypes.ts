// types/ratingTypes.ts
import { Types } from 'mongoose';

export interface IRating {
    _id?: Types.ObjectId;
    rater: Types.ObjectId;        // who rated
    targetType: 'User' | 'Post' | 'Comment';  // what entity is rated
    targetId: Types.ObjectId;     // id of rated user/post/comment
    rating: number;               // numeric rating, e.g. 1-5
    createdAt?: Date;
    updatedAt?: Date;
}
