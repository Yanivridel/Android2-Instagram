import { View } from 'react-native';
import { Image } from '../ui/image';
import { Text } from '../ui/text';

interface ProfileHeaderProps {
  image: string;
  fullName: string;
  gender: string;
  yearOfJoining: number;
}

export default function ProfileHeader({
  image,
  fullName,
  gender,
  yearOfJoining,
}: ProfileHeaderProps) {
  return (
    <>
      <View className="flex flex-row items-center  gap-4 ">
        <Image
          source={{ uri: image }}
          style={{ width: 100, height: 100, borderRadius: 50 }}
          className="rounded-full"
        />
        <View className="flex gap-1">
          <Text className="font-bold">{fullName}</Text>
          <View className="flex flex-row gap-4">
            <Text className="text-gray-400">{gender}</Text>
            <Text className="text-gray-400">|</Text>
            <Text className="text-gray-400">Joined {yearOfJoining}</Text>
          </View>
        </View>
      </View>
    </>
  );
}
