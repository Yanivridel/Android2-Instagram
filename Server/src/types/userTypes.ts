
export interface IUser extends Document {
    firebaseUid: string;
    username: string;
    email: string;
    role: 'user' | 'admin';
}