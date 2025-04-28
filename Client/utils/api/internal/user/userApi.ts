// signup.ts
import { User } from '@/context/userStore';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import { FirebaseAuth } from '@/FirebaseConfig';
import { api } from '../apiService';

export interface RegisterUserReq {
    email: string;
    pass: string;
    username: string;
}

interface RegisterUserRes {
    userId: string;
    user: User;
}

export const registerUser = async ({ email, pass, username }: RegisterUserReq): Promise<RegisterUserRes | null> => {
    try {
        const userCredential = await createUserWithEmailAndPassword(FirebaseAuth, email, pass);
        const firebaseUid = userCredential.user.uid;
        console.log("REGISTER firebaseUid", firebaseUid);
        
        const response = await api.post<RegisterUserRes>('api/users/register', {
            firebaseUid,
            email,
            username
        }, { skipAuth: true });
        
        console.log("Registration successful:", response.data);
        return response.data;
    } catch (error: any) {
        console.error("Registration error:", error?.response?.data || error.message);
        return null;
    }
};

interface LoginUserReq {
    email: string;
    pass: string;
}

interface LoginUserRes extends User {
    token: string;
}

export const loginUser = async ({ email, pass }: LoginUserReq): Promise<LoginUserRes | null> => {
    try {
        // Firebase authentication
        const userCredential = await signInWithEmailAndPassword(FirebaseAuth, email, pass);
        
        // console.log("userCredential", userCredential);

        // Get user data from your server
        // The token will be automatically added by the interceptor
        const response = await api.get<LoginUserRes>('api/users/login');

        console.log("response", response);
        
        console.log("Login successful:", response.data);
        return response.data;
    } catch (error: any) {
        console.error("Login error:", error?.response?.data || error.message);
        return null;
    }
};

