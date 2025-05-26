import { View, Text } from 'react-native'
import React from 'react'
import { Box } from '../ui/box'
import { IC_AddPost, IC_Arrow_Down, IC_HamburgerMenu } from '@/utils/constants/Icons'


const ProfileTopBar = () => {
    return (
    <Box className='flex-row w-full justify-between items-center px-5 pt-5'>
        {/* Name & Arrow Down */}
        <Box className="flex-row gap-2 items-center">
            <Text className='text-white text-2xl font-bold'>Yanivridel</Text>
            <IC_Arrow_Down className="w-5 h-5" color='white'/>
        </Box>
        {/* Post & Settings */}
        <Box className="flex-row gap-6">
            <IC_AddPost className="w-7 h-7" color='white'/>
            <IC_HamburgerMenu className="w-7 h-7" color='white'/>
        </Box>
    </Box>
    )
}

export default ProfileTopBar