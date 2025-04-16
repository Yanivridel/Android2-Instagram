import React from 'react';
import { Switch, SwitchProps } from 'react-native';

interface PurpleSwitchProps extends SwitchProps {}

const PurpleSwitch: React.FC<PurpleSwitchProps> = ({ ...props }) => {
  const purple500 = '#5506FD';
  return <Switch trackColor={{ true: purple500 }} {...props} />;
};

export default PurpleSwitch;
