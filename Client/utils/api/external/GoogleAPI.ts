//@ts-ignore
import { GOOGLE_MAP_API_KEY } from '@env';

export const fetchAutocomplete = async (query: string) => {
    const endpoint = `https://maps.googleapis.com/maps/api/place/autocomplete/json`;
    const params = new URLSearchParams({
        input: query,
        key: GOOGLE_MAP_API_KEY,
        types: 'address',
    });

    try {
        const response = await fetch(`${endpoint}?${params}`);
        const data = await response.json();
        if (data.status === 'OK') {
            return data.predictions;
        } else {
            console.log('Error fetching autocomplete results:', data.error_message);
            return [];
        }
    } catch (error) {
        console.log('Error fetching autocomplete data:', error);
        return [];
    }
};

export const getPlaceIdDetails = async (placeId: string) => {
    const endpoint = `https://maps.googleapis.com/maps/api/place/details/json`;
    const params = new URLSearchParams({
        placeid: placeId,
        key: GOOGLE_MAP_API_KEY,
        fields: 'geometry,address_component'
    });

    try {
        const response = await fetch(`${endpoint}?${params}`);
        const data = await response.json();

        if (data.status === 'OK' && data.result.geometry) {
            return data.result;
        } else {
            console.error('Error fetching coordinates:', data.error_message);
            return null;
        }
    } catch (error) {
        console.error('Error fetching place details:', error);
        return null;
    }
};