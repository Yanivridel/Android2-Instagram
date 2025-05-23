import { useRef } from 'react';

export function useDoublePress(onDoublePress: () => void, delay = 300) {
    const lastPress = useRef<number>(0);

    return () => {
        const time = new Date().getTime();
        if (time - lastPress.current < delay) {
        onDoublePress();
        }
        lastPress.current = time;
    };
}
