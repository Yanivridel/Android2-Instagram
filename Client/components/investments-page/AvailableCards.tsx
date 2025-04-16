import { View } from 'react-native';
import { Button } from '../ui/button';
import { Image } from '../ui/image';
import { FontAwesome } from '@expo/vector-icons';
import { Text } from '../ui/text';

interface AvailableCardsProps {
  investment: {
    id: number;
    name: string;
    image: string;
  };
  setCurrentInvestmentID: React.Dispatch<React.SetStateAction<number | undefined>>;
}

export default function AvailableCards({
  investment,
  setCurrentInvestmentID,
}: AvailableCardsProps) {
  return (
    <Button
      onPress={() => setCurrentInvestmentID(investment.id)}
      className="border-vlack m-2 flex h-fit items-center justify-center border bg-transparent">
      <View className="flex items-center justify-center">
        {investment.image ? (
          <Image source={{ uri: investment.image }} />
        ) : (
          <FontAwesome name="times-rectangle-o" size={50} color="black" />
        )}
        <Text>{investment.name}</Text>
      </View>
    </Button>
  );
}
