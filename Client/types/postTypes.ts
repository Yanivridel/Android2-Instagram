import { IUser } from "./userTypes"

export interface Post {
    id: string
    user: {
        name: string
        avatar: string  // URL to the user’s avatar image
    }
    image: string     // URL to the post’s main image
    caption: string
    likes: number
    timestamp: string // e.g. "2h ago"
}

export interface IComment {
    id: string;
    text: string;
    user: string; // CHANGE LATER TO IUser
}