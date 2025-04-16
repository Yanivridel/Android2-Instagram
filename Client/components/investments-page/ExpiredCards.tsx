import { View } from 'react-native';
import { Button } from '../ui/button';
import { Text } from '../ui/text';
import { Image } from '../ui/image';
import { FontAwesome } from '@expo/vector-icons';

interface ExpiredCardsProps {
  investment: {
    name: string;
    image: string;
    amount: string;
    period: string;
    paid: number;
    arrival: number;
    percentage: number;
  };
}

export default function ExpiredCards({ investment }: ExpiredCardsProps) {
  return (
    <View className="m-2 flex h-fit items-center justify-around gap-2 border border-black bg-transparent">
      <Text>{investment.name}</Text>
      {investment.image ? (
        <Image source={{ uri: investment.image }} />
      ) : (
        <FontAwesome name="times-rectangle-o" size={50} color="black" />
      )}
      <View className="flex w-full flex-row justify-around">
        <Text>Amount: {investment.amount}</Text>
        <Text>Period: {investment.period}</Text>
      </View>
      <View className="flex w-full flex-row justify-around">
        <Text>Paid: {new Intl.NumberFormat('en-US').format(investment.paid)}$</Text>
        <Text>Arrival: {new Intl.NumberFormat('en-US').format(investment.arrival)}$</Text>
        <Text>
          {investment.percentage > 0 ? `+${investment.percentage}` : `${investment.percentage}`}%
        </Text>
      </View>
    </View>
  );
}
