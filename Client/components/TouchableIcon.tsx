import React from 'react';
import { TouchableOpacity } from 'react-native';
import { ViewStyle } from 'react-native';

interface TouchableIconProps {
    onPress?: () => void;
    Icon: React.ElementType;
    className?: string;
    IconClassName?: string;
    color?: string;
    style?: ViewStyle;
}

const TouchableIcon: React.FC<TouchableIconProps> = ({
    onPress,
    Icon,
    className = '',
    color = 'black',
    IconClassName = '',
    style = {},
}) => {
return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.7} style={style} className={className}>
        <Icon className={IconClassName} color={color} />
    </TouchableOpacity>
);
};

export default TouchableIcon;
