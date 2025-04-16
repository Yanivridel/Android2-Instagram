import React from 'react';
import { Modal, ModalBackdrop, ModalBody, ModalContent } from '../ui/modal';
import { Box } from '../ui/box';
import { PartyPopper } from 'lucide-react-native';
import { Text } from '../ui/text';
import { Button, ButtonText } from '../ui/button';
import { IM_PARTY } from '@/utils/constants/Images';
import { useTheme } from '@/utils/Themes/ThemeProvider';
import MyLinearGradient from '../gradient/MyLinearGradient';
import { useTranslation } from 'react-i18next';

interface MembershipModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
}
const MembershipModal = ({ isOpen, onClose, onSuccess }: MembershipModalProps) => {
    const { appliedTheme } = useTheme();
    const { t } = useTranslation();

    return (
    <Modal isOpen={isOpen} onClose={onClose}>
        <ModalBackdrop />
        <ModalContent 
            className={`w-[90%] rounded-xl bg-card-${appliedTheme} p-6 items-center`}
        >
            <ModalBody>
                <Box className='items-center'>
                    <Box className="mb-4">
                        <IM_PARTY className='h-[200px] '/>
                    </Box>

                    {/* Congratulations Title */}
                    <Text 
                        className="text-xl font-bold text-purple-600 mb-2"
                    >
                        {t('membershipModal.congratulations')}
                    </Text>

                    {/* Subtext */}
                    <Text 
                        className="text-center text-gray-600 mb-6"
                    >
                        {t('membershipModal.youAreMemberNow')}
                        {t('membershipModal.getReadyToStart')}
                    </Text>

                    {/* Submit Button */}
                    <MyLinearGradient type='button' color='purple'>
                        <Button 
                            className="w-fit px-10 justify-center items-center"
                            onPress={() => {onClose(); onSuccess()}}
                        >
                            <ButtonText className={`text-white`}>
                            {t('membershipModal.imReadyToStart')}
                            </ButtonText>
                        </Button>
                    </MyLinearGradient>
                </Box>
            </ModalBody>
        </ModalContent>
    </Modal>
    );
};

export default MembershipModal;