import { Entypo } from '@expo/vector-icons';
import { Button } from './ui/button';

interface PasswordVisibilityChangeButtonProps {
  isPasswordVisible: boolean;
  setIsPasswordVisible: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function PasswordVisibilityChangeButton({
  isPasswordVisible,
  setIsPasswordVisible,
}: PasswordVisibilityChangeButtonProps) {
  return (
    <Button className="bg-transparent" onPress={() => setIsPasswordVisible(!isPasswordVisible)}>
      <Entypo name={isPasswordVisible ? 'eye-with-line' : 'eye'} size={24} color="black" />
    </Button>
  );
}
