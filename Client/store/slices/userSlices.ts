import { IUser } from "@/types/userTypes";
import { logoutUser } from "@/utils/api/internal/user/userApi";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const initialState: IUser = {
    _id: "",
    firebaseUid: "",
    username: "",
    email: "",
    role: "user",
    rating: 2.5,
    bio: "",
    profileImage: "",
    posts: [],
    likedPosts: [],
    likedComments: [],
    followers: [],
    following: [],
    groups: [],
    taggedPosts: [],
    notifications: [],
    createdAt: "",
    updatedAt: "",
    __v: 0,
};

const userSlice = createSlice({
    name: "currentUser",
    initialState,
    reducers: {
        setUser: (state, action: PayloadAction<Partial<IUser>>) => {
            Object.assign(state, { ...state, ...action.payload });
        },
        unsetUser: (state) => {
            Object.assign(state, initialState);
            logoutUser();
        },
        updateProfileImage: (state, action: PayloadAction<string>) => {
            state.profileImage = action.payload;
        },
        updateBio: (state, action: PayloadAction<string>) => {
            state.bio = action.payload;
        },
        updateFollowers: (state, action: PayloadAction<string[]>) => {
            state.followers = action.payload;
        },
        updateFollowing: (state, action: PayloadAction<string[]>) => {
            state.following = action.payload;
        },
    },
});

export const {
    setUser,
    unsetUser,
    updateProfileImage,
    updateBio,
    updateFollowers,
    updateFollowing,
} = userSlice.actions;

export default userSlice.reducer;
