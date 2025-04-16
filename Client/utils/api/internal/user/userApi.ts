// signup.js
import axios from 'axios';

import { BASE_API_URL } from '@env';
import { User } from '@/context/userStore';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import { FirebaseAuth } from '@/FirebaseConfig';

const token = await FirebaseAuth.currentUser?.getIdToken();

interface loginUserReq {
    email: string,
    password: string;
}
interface loginUserRes extends User {
    token: string;
}

export const loginUser = async ({ email, password }: loginUserReq): Promise<loginUserRes | null> => {
    try {
        const userCredential = await signInWithEmailAndPassword(FirebaseAuth, email, password);
        const user = userCredential.user;

        // Step 3: Send ID token to your backend
        const response = await axios.get(`${BASE_API_URL}/api/users/login`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        console.log("Login successful:", response.data);
        return response.data;
    } catch (error: any) {
        console.error("Login error:", error?.response?.data || error.message);
        return null;
    }
};

interface registerUserReq {
    fName: string,
    lName: string,
    email: string,
    password: string;
}

interface registerUserRes {
    userId: string;
}

export const registerUser = async ({ fName, lName, email, password }: registerUserReq): Promise<registerUserRes | null> => {
    try {
        const userCredential = await createUserWithEmailAndPassword(FirebaseAuth, email, password);
        const user = userCredential.user;

        const token = await user.getIdToken();

        // 3. Send ID token + custom data (like name) to your server
        const response = await axios.post(`${BASE_API_URL}/api/users/register`, {
            fName,
            lName,
        }, 
        {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        console.log("Signup successful:", response.data);
        return response.data;
    } catch (error: any) {
        console.error("Signup error:", error?.response?.data || error.message);
        return null;
    }
};

