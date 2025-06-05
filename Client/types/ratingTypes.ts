
export interface IRating {
    _id?: string;
    rater: string;               // who rated
    targetType: 'User' | 'Post' | 'Comment';  // what entity is rated
    targetId: string;            // id of rated user/post/comment
    rating: number;              // numeric rating, e.g. 1-5
    createdAt?: Date | string;
    updatedAt?: Date | string;
}