import { View, Text } from 'react-native'
import React from 'react'
import { Box } from '../ui/box'
import { IC_AddPost, IC_Arrow_Down, IC_Edit, IC_HamburgerMenu } from '@/utils/constants/Icons'
import TouchableIcon from '../TouchableIcon'
import { RootState } from '@/store'
import { useSelector } from 'react-redux'
import { formatUsername } from '@/utils/functions/help'


const ProfileTopBar = () => {
    const currentUser = useSelector((state: RootState) => state.currentUser);

    return (
    <Box className='flex-row w-full justify-between items-center px-5 pt-5'>
        {/* Name & Arrow Down */}
        <Box className="flex-row gap-2 items-center">
            <Text className='text-white text-2xl font-bold'>{formatUsername(currentUser.username)}</Text>
            <TouchableIcon Icon={IC_Arrow_Down} IconClassName="w-5 h-5" color='white'/>
        </Box>
        {/* Post & Settings */}
        <Box className="flex-row gap-6">
            <TouchableIcon Icon={IC_AddPost} IconClassName="w-7 h-7" color='white'/>
            <TouchableIcon Icon={IC_HamburgerMenu} IconClassName="w-7 h-7" color='white'/>
        </Box>
    </Box>
    )
}

export default ProfileTopBar