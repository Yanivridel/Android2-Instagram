import React, { useState } from 'react';
import { Platform } from 'react-native';
import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';
import { Box } from './ui/box';
import { Button, ButtonText } from './ui/button';

interface DatePickerProps {
    date: Date | null;
    setDate: React.Dispatch<React.SetStateAction<Date | null>>;
}
const DatePicker = ({ date, setDate }: DatePickerProps) => {
    const [show, setShow] = useState(false);

    const onChange = (event: DateTimePickerEvent, selectedDate: Date | undefined) => {
        if (selectedDate) {
            setDate(selectedDate);
        }
        setShow(false);
    };

    return (
        <Box >
            <Button variant='link' onPress={() => setShow(true)}>
                <ButtonText>Select Date</ButtonText>
            </Button>
            {show && (
                <DateTimePicker
                value={date || new Date()}
                mode="date"
                display={Platform.OS === 'ios' ? 'inline' : 'default'}
                onChange={onChange}
                />
            )}
        </Box>
    );
};

export default DatePicker;
