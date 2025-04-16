import { View, Text } from 'react-native';
import { Button } from '../ui/button';
import { Image } from '../ui/image';
import { FontAwesome } from '@expo/vector-icons';

interface OngoingCardsProps {
  investment: {
    name: string;
    image: string;
    amount: string;
    timeRemain: string;
    paid: number;
    currentValue: number;
    percentage: number;
  };
}

export default function OngoingCards({ investment }: OngoingCardsProps) {
  return (
    <View className="m-2 flex h-fit items-center justify-around gap-2 border border-black bg-transparent">
      <Button className="absolute right-4 top-4 border border-black bg-[#be3a31]">
        <Text className="text-white">Close</Text>
      </Button>
      <Text>{investment.name}</Text>
      {investment.image ? (
        <Image source={{ uri: investment.image }} />
      ) : (
        <FontAwesome name="times-rectangle-o" size={50} color="black" />
      )}
      <View className="flex w-full flex-row justify-around">
        <Text>Amount: {investment.amount}</Text>
        <Text>Remaining time: {investment.timeRemain}</Text>
      </View>
      <View className="flex w-full flex-row justify-around">
        <Text>Paid: {new Intl.NumberFormat('en-US').format(investment.paid)}$</Text>
        <Text>
          Current value: {new Intl.NumberFormat('en-US').format(investment.currentValue)}$
        </Text>
        <Text>
          {investment.percentage > 0 ? `+${investment.percentage}` : `${investment.percentage}`}%
        </Text>
      </View>
    </View>
  );
}
