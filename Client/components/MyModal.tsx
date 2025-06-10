import React from 'react';
import { Modal, ModalBackdrop, ModalBody, ModalContent, ModalFooter, ModalHeader } from './ui/modal';
import { Text } from './ui/text';
import { Button, ButtonText } from './ui/button';

/**
 * @interface CustomModalProps
 * @property {boolean} isOpen - Controls the visibility of the modal.
 * @property {() => void} onClose - Callback function triggered when the modal is requested to close (e.g., backdrop press).
 * @property {string} title - The text displayed in the modal header.
 * @property {string} message - The text displayed in the modal body.
 * @property {string} buttonText - The text displayed on the primary action button.
 * @property {() => void} onButtonPress - Callback function triggered when the primary action button is pressed.
 */
interface CustomModalProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    message: string;
    buttonText: string;
    onButtonPress: () => void;
}

/**
 * CustomModal Component
 *
 * A reusable gluestack-ui modal component for displaying alerts or confirmations.
 * It provides a structured layout with a header, body, and a single action button.
 *
 * @param {CustomModalProps} props - The properties for the modal component.
 * @returns {JSX.Element} The rendered modal component.
 */
const MyModal: React.FC<CustomModalProps> = ({
    isOpen,
    onClose,
    title,
    message,
    buttonText,
    onButtonPress,
}) => {
    return (
        // @ts-ignore
        <Modal size='md' isOpen={isOpen} onClose={onClose}>
        <ModalBackdrop />
        <ModalContent>
            <ModalHeader>
            {/* Using gluestack-ui's Text component and NativeWind for styling */}
            <Text className='text-lg font-bold'>
                {title}
            </Text>
            </ModalHeader>
            <ModalBody>
            {/* Using gluestack-ui's Text component and NativeWind for styling */}
            <Text className='text-md'>
                {message}
            </Text>
            </ModalBody>
            <ModalFooter>
            {/* Using gluestack-ui's Button and ButtonText components */}
            <Button onPress={onButtonPress}>
                <ButtonText>
                {buttonText}
                </ButtonText>
            </Button>
            </ModalFooter>
        </ModalContent>
    </Modal>
    );
};

export default MyModal;