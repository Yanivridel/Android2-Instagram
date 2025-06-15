import { IPost } from '@/types/postTypes';
import { api } from './apiService';
import { IGroup } from 'types/groupTypes';

// Get all groups
export const getAllGroups = async (): Promise<IGroup[]> => {
    const { data } = await api.get<IGroup[]>('api/groups');
    return data;
};

// Get group by ID
export const getGroupById = async ({ groupId }: { groupId: string }): Promise<IGroup | null> => {
    const { data } = await api.get<IGroup>(`api/groups/${groupId}`);
    return data;
};

// Create group
export const createGroup = async (group: Partial<IGroup>): Promise<IGroup> => {
    const { data } = await api.post<IGroup>('api/groups', group);
    return data;
};

// Update group
export const updateGroup = async ({
    groupId,
    updates
}: {
    groupId: string;
    updates: Partial<IGroup>;
}): Promise<IGroup | null> => {
    const { data } = await api.put<IGroup>(`api/groups/${groupId}`, updates);
    return data;
};

// Delete group
export const deleteGroup = async ({ groupId }: { groupId: string }): Promise<{ message: string }> => {
    const { data } = await api.delete<{ message: string }>(`api/groups/${groupId}`);
    return data;
};

export const getPostsByGroupId = async ({ groupId }: { groupId: string }): Promise<IPost[]> => {
    const { data } = await api.get<IPost[]>(`api/groups/posts/${groupId}`);
    return data;
};

export const joinGroup = async ({ groupId }: { groupId: string }): Promise<{ message: string; group: IGroup }> => {
    const { data } = await api.post<{ message: string; group: IGroup }>(`api/groups/join/${groupId}`);
    return data;
};

export const leaveGroup = async ({ groupId }: { groupId: string }): Promise<{ message: string; group: IGroup }> => {
    const { data } = await api.post<{ message: string; group: IGroup }>(`api/groups/leave/${groupId}`);
    return data;
};

export const getMyGroups = async (): Promise<IGroup[]> => {
    const { data } = await api.get<IGroup[]>('api/groups/me');
    return data;
};