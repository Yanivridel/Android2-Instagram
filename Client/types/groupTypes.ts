
export interface IGroup {
    _id?: string;
    name: string;
    description?: string;
    members: string[];
    managers: string[];
    createdAt?: Date | string;
    updatedAt?: Date | string;
}