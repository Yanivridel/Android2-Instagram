import { View } from 'react-native';
import { Box } from './ui/box';
import { Text } from './ui/text';
import { AntDesign } from '@expo/vector-icons';
import SliderWithArrow from './SliderWithArrow';
import { Button } from './ui/button';
import { cn } from './ui/cn';

interface SliderWithPlusMinusProps {
  maxValue: number;
  setSliderValue: React.Dispatch<React.SetStateAction<number>>;
  sliderValue: number;
  buttonText: string;
  classNameBtn?: string;
}

export default function SliderWithPlusMinus({
  maxValue,
  setSliderValue,
  sliderValue,
  buttonText,
  classNameBtn
}: SliderWithPlusMinusProps) {
  return (
    <Box className="flex flex-col items-center">
      <View className="flex w-full flex-row justify-between">
        <Text>1</Text>
        <View className="flex flex-row items-center justify-center gap-2 border border-black">
          <Text className="pl-2">${sliderValue}</Text>
          <View className="flex">
            <AntDesign
              name="up"
              size={15}
              color="black"
              className="border border-black"
              onPress={() => setSliderValue((prev) => prev + 1)}
            />
            <AntDesign
              name="down"
              size={15}
              color="black"
              className="border border-black"
              onPress={() => setSliderValue((prev) => prev - 1)}
            />
          </View>
        </View>
        <Text>{maxValue}</Text>
      </View>
      <View className="mt-2 flex w-full flex-row justify-between">
        <AntDesign
          name="minuscircleo"
          size={30}
          color="black"
          onPress={() => setSliderValue((prev) => prev - 1)}
          className=""
        />
        <View className="mx-4 flex-1 ">
          <SliderWithArrow
            sliderValue={sliderValue}
            setSliderValue={setSliderValue}
            maxValue={maxValue}
          />
        </View>
        <AntDesign
          name="pluscircleo"
          size={30}
          color="black"
          onPress={() => setSliderValue((prev) => prev + 1)}
          className=""
        />
      </View>
      <View className="flex w-full items-center">
        <Button className={cn("bg-green-700",classNameBtn)}>
          <Text className="text-white">{buttonText}</Text>
        </Button>
      </View>
    </Box>
  );
}
