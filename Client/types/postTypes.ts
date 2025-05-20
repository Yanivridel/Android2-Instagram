
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
