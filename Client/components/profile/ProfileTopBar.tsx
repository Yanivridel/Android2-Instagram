import { View, Text } from 'react-native'
import React from 'react'
import { Box } from '../ui/box'
import { IC_AddPost, IC_Arrow_Down } from '@/utils/constants/Icons'


const ProfileTopBar = () => {
    return (
    <Box className='flex-row w-full justify-between items-center'>
        {/* Name & Arrow Down */}
        <Box className="flex-row gap-2">
            <Text className='text-white text-2xl font-bold'>Yanivridel</Text>
            <IC_Arrow_Down className="w-4 h-4" color='white'/>
        </Box>
        {/* Post & Settings */}
        <Box className="flex-row gap-2">
            <IC_AddPost className="w-4 h-4" color='white'/>
        </Box>
    </Box>
    )
}

export default ProfileTopBar