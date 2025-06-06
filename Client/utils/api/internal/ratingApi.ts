import { IRating as IUser } from '@/types/ratingTypes';
import { api } from './apiService';

interface getRatingsByTargetReq {
    targetType: "Post" | "Comment" | "User",
    targetId: string,
}
export const getAllRatingsByTarget = async ({ targetType, targetId}: getRatingsByTargetReq): Promise<IUser[] | null> => {
    try {
        const { data } = await api.get<IUser[]>(`api/ratings?targetType=${targetType}&targetId=${targetId}`);
        return data;
    } catch (error: any) {
        console.error("Create chat error:", error?.response?.data || error.message);
        return null;
    }
};

export const getAvgRatingsByTarget = async ({ targetType, targetId}: getRatingsByTargetReq): Promise<IUser[] | null> => {
    try {
        const { data } = await api.get<IUser[]>(`api/ratings/average?targetType=${targetType}&targetId=${targetId}`);
        return data;
    } catch (error: any) {
        console.error("Create chat error:", error?.response?.data || error.message);
        return null;
    }
};

export const getTop10Ratings = async ({ userId }: { userId: string}): Promise<Partial<IUser>[] | null> => {
    try {
        const { data } = await api.get<Partial<IUser>[]>(`api/ratings/top`);
        return data;
    } catch (error: any) {
        console.error("Create chat error:", error?.response?.data || error.message);
        return null;
    }
};

interface createRatingReq {
    targetType: "Post" | "Comment" | "User",
    targetId: string,
    rating: number
}
export const createRating = async ({ targetType, targetId, rating}: createRatingReq): Promise<IUser | null> => {
    try {
        const { data } = await api.post<IUser>(`api/ratings/`,  { targetType, targetId, rating});
        return data;
    } catch (error: any) {
        console.error("Create chat error:", error?.response?.data || error.message);
        return null;
    }
};

export const deleteRating = async ({ targetType, targetId }: getRatingsByTargetReq): Promise<string | null> => {
    try {
        const { data } = await api.delete<string>(`api/ratings?targetType=${targetType}&targetId=${targetId}`);
        return data;
    } catch (error: any) {
        console.error("Create chat error:", error?.response?.data || error.message);
        return null;
    }
};

