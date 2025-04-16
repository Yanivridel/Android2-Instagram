import { View, Text } from 'react-native'
import React from 'react'
import { Props } from '@/types/NavigationTypes'

const ChatScreen:React.FC<Props> = ({ navigation }) => {
    return (
        <View>
            <Text>ChatScreen</Text>
        </View>
    )
}

export default ChatScreen