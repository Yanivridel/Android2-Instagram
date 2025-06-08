import React from 'react';
import { Avatar, AvatarFallbackText, AvatarImage } from '@/components/ui/avatar';
import { IUser } from '@/types/userTypes';
import { cn } from './ui/cn';

interface UserAvatarProps {
    username: string;
    profileImage?: string;
    rating: number; // assumed from 0 to 5
    className?: string; // Optional Tailwind class override
    sizePercent?: number; // Optional size override (default is 30%)
    hasBorder?: boolean;
}

const getBorderStyleByRating = (rating: number) => {
    const clamped = Math.max(0, Math.min(rating, 5));
    const tier = Math.floor(clamped * 2);
    
    const borderStyles = [
        'border-gray-300',       // 0
        'border-gray-400',       // 0.5
        'border-zinc-500',       // 1.0
        'border-indigo-300',     // 1.5
        'border-indigo-500',     // 2.0
        'border-indigo-700',     // 2.5
        'border-violet-500',     // 3.0
        'border-violet-700',     // 3.5
        'border-purple-700',     // 4.0
        'border-[#d4af37]',      // 4.5–5.0 → Gold
    ];

    return borderStyles[tier];
};

const UserAvatar: React.FC<UserAvatarProps> = ({ username, profileImage, rating , className, hasBorder=true, sizePercent = 30 }) => {
    const borderClass = getBorderStyleByRating(rating);

    return (
        <Avatar
            className={cn(`bg-indigo-600 ${borderClass} w-[${sizePercent}%] aspect-square`,
                hasBorder ? "border-[3px]" : "",
                className)}
        >
            <AvatarFallbackText className="text-white">
                {username}
            </AvatarFallbackText>
            <AvatarImage
                source={{
                    uri: profileImage || `https://i.pravatar.cc/150?u=${username}`,
                }}
                alt="User Avatar"
            />
        </Avatar>
    );
};

export default UserAvatar;
