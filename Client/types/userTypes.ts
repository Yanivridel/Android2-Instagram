
export interface IUser {
    _id: string;
    firebaseUid: string;
    username: string;
    email: string;
    role: "user" | "admin"; // Add other roles if needed
    createdAt: string; // ISO date string
    updatedAt: string; // ISO date string
    __v: number;
}
