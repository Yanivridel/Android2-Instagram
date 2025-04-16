import { Box } from '@/components/ui/box';
import { IC_Card_V2, IC_Identity } from '@/utils/constants/Icons';
import { useTheme } from '@/utils/Themes/ThemeProvider';
import { useState } from 'react';
import { Text } from './ui/text';
import { Button, ButtonText } from './ui/button';
import MyLinearGradient from './gradient/MyLinearGradient';
import { TouchableOpacity } from 'react-native';

interface ThingToDoProps {
  thingToDo: {
    icon: React.ElementType;
    header: string;
    description: string;
    actionText: string;
    actionFunction: () => void;
  }[];
}

export default function ThingToDo({ thingToDo }: ThingToDoProps) {
  const { appliedTheme } = useTheme();
  const [currentIndex, setCurrentIndex] = useState(0);
  const CurrentIcon = thingToDo[currentIndex].icon;

  function handleNextMission() {
    if (currentIndex === thingToDo.length - 1) {
      return setCurrentIndex(0);
    }
    setCurrentIndex((prev) => prev + 1);
  }

  if (thingToDo.length === 0) {
    return <></>;
  }

  return (
    <Box className="flex w-full items-center justify-center">
      <Box className=" flex w-full flex-row justify-between p-2">
        <Text className={`p-2 text-[15px] font-semibold text-white`}>KYC</Text>
        {thingToDo.length > 1 && (
          <Text className={`rounded-full bg-[#ffffff29] p-2 text-white`}>
            {currentIndex + 1} / {thingToDo.length}
          </Text>
        )}
      </Box>
      <Box className={`bg-card-${appliedTheme}  flex h-fit w-full flex-row gap-3 rounded-xl p-4`}>
        <CurrentIcon className="h-[48px] w-[48px]" />

        <Box className="flex h-fit w-[80%] gap-3">
          <Text className={`text-text-${appliedTheme} text-[17px] font-semibold`}>
            {thingToDo[currentIndex].header}
          </Text>
          <Text className={`text-subText-${appliedTheme} w-auto text-[14px] font-medium`}>
            {thingToDo[currentIndex].description}
          </Text>
          <MyLinearGradient type="button" color="purple">
            <TouchableOpacity onPress={thingToDo[currentIndex].actionFunction}>
              <Text className={`text-[15px] font-medium text-center text-white`}>
                {thingToDo[currentIndex].actionText}
              </Text>
            </TouchableOpacity>
          </MyLinearGradient>
        </Box>
      </Box>
      {thingToDo.length > 1 && (
        <TouchableOpacity
          className={`h-4 w-[90%] rounded-b-xl bg-gray-500`}
          onPress={handleNextMission}>
        </TouchableOpacity>
      )}
    </Box>
  );
}
