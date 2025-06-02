
export interface IPostClient {
    _id: string;
    content: string;
    imageUrls: string[];
    createdAt: string; // ISO date string
    updatedAt: string;
    author: string; // User ID
    group?: string; // Group ID
    isPublic: boolean;
    rating: number;
    comments: string[]; // Comment IDs
    likes: string[];    // User IDs
    locationString: string;
}


// CHANGE LATER TO IUser
export interface IComment {
    id: string;
    text: string;
    user: string; 
}