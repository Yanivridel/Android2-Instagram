import React from 'react';
import { TouchableOpacity } from 'react-native';
import { ViewStyle } from 'react-native';

interface TouchableIconProps {
    onPress: () => void;
    Icon: React.ElementType;
    className?: string;
    color?: string;
    style?: ViewStyle;
}

const TouchableIcon: React.FC<TouchableIconProps> = ({
    onPress,
    Icon,
    className = '',
    color = 'black',
    style = {},
}) => {
return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.7} style={style}>
        <Icon className={className} color={color} />
    </TouchableOpacity>
);
};

export default TouchableIcon;
