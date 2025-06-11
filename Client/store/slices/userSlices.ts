import { IUser } from "@/types/userTypes";
import { logoutUser } from "@/utils/api/internal/userApi";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const initialState: IUser = {
    _id: "",
    firebaseUid: "",
    username: "",
    email: "",
    role: "user",
    ratingStats: { averageScore: 0, totalRatings: 0},
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
    gender: "he/him",
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
        updateRatingStats: (state, action: PayloadAction<any>) => {
			if (state) {
				state.ratingStats = action.payload;
			}
		}
    },
});

export const {
    setUser,
    unsetUser,
    updateProfileImage,
    updateBio,
    updateFollowers,
    updateFollowing,
    updateRatingStats,
} = userSlice.actions;

export default userSlice.reducer;
