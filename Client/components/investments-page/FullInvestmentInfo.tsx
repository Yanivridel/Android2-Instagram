import { FontAwesome, Ionicons } from '@expo/vector-icons';
import { Image, ScrollView } from 'react-native';
import { View } from 'react-native';
import { Button } from '../ui/button';
import { Text } from '../ui/text';

interface FullInvestmentsInfoProps {
  currentInvestment:
    | {
        id: number;
        name: string;
        amountFrom: string;
        period: string;
        currentValue: number;
        image: string;
        description: string;
        estimationArriving: number;
        Percentages: number;
        securityBelt: number;
        cashOut: number;
      }
    | undefined;
  handleBackPress: () => void;
  handleSubmitPress: () => void;
}

export default function FullInvestmentsInfo({
  currentInvestment,
  handleBackPress,
  handleSubmitPress,
}: FullInvestmentsInfoProps) {
  if (!currentInvestment) {
    return <></>;
  }
  return (
    <View className="absolute bottom-0 left-0 right-0 top-0 z-50 flex h-full bg-white p-4">
      <Button
        onPress={handleBackPress}
        className="absolute left-4 top-4 mb-2 h-fit self-start bg-transparent">
        <Ionicons name="chevron-back-circle-outline" size={55} color="black" />
      </Button>
      <View className="mt-2 flex items-center justify-center gap-4">
        <View>
          {currentInvestment.image ? (
            <Image source={{ uri: currentInvestment.image }} />
          ) : (
            <FontAwesome name="times-rectangle-o" size={100} color="black" />
          )}
          <Text className="font-bold text-black">{currentInvestment.name}</Text>
        </View>
        <View className="flex w-full flex-row justify-around">
          <Text>Amount: {currentInvestment.amountFrom}</Text>
          <Text>Period: {currentInvestment.period}</Text>
        </View>

        <Text>
          Current value: {new Intl.NumberFormat('en-US').format(currentInvestment.currentValue)}$
        </Text>
        <ScrollView className="h-[200px]">
          <Text>{currentInvestment.description}</Text>
        </ScrollView>
        {/* <View>
          <ScrollabeDescription desc={currentInvestment.description} />
        </View> */}
        <View className="flex w-full flex-row justify-around">
          <Text> </Text>
          <Text>Estimated arrival: {currentInvestment.estimationArriving}</Text>
          <Text>
            {currentInvestment.Percentages > 0
              ? `+${currentInvestment.Percentages}`
              : `${currentInvestment.Percentages}`}
            %
          </Text>
        </View>
        <View className="flex w-full flex-row justify-around">
          <Text>Security belt: {currentInvestment.securityBelt}$</Text>
          <Text>Cash out: {currentInvestment.cashOut}$</Text>
        </View>
        <Button className="rounded-lg border border-black bg-[#469c30]" onPress={handleSubmitPress}>
          <Text className="text-white">SUBMIT</Text>
        </Button>
      </View>
    </View>
  );
}
