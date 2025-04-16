import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface User {
    userId: string;
    fName: string;
    lName: string;
    phone: string;
    email: string;
    nlve: string;
    cryptoCoins: {ownedCoins: string, amount: string, value: string}[];
    avatar?: string;
}

interface UserState {
    user: User | null;
    setUser: (user: User) => void;
    logout: () => void;
}

export const useUserStore = create<UserState>()(
    persist(
        (set) => ({
            user: null,
            setUser: (user) => set({ user }),
            logout: () => set({ user: null }),
        }),
        {
            name: "user-storage",
        }
    )
);
