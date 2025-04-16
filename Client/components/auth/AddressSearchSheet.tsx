import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Actionsheet, ActionsheetBackdrop, ActionsheetContent, ActionsheetDragIndicator, ActionsheetDragIndicatorWrapper, ActionsheetItem, ActionsheetItemText } from '@/components/ui/actionsheet';
import { Search, MapPin } from 'lucide-react-native';
import MapView, { Marker } from 'react-native-maps';

import { Box } from '../ui/box';
import { useTheme } from '@/utils/Themes/ThemeProvider';
import { Text } from '../ui/text';
import { fetchAutocomplete, getPlaceIdDetails } from '@/utils/api/external/GoogleAPI';
import { FlatList, Keyboard, KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, TouchableOpacity, TouchableWithoutFeedback } from 'react-native';
import { IC_ChevronLeft, IC_ChevronRight, IC_CurrentLocation, IC_MapMarker } from '@/utils/constants/Icons';
import InputAuth from './InputAuth';
import { Divider } from 'react-native-paper';
import { Address, coords, GooglePlace } from '@/types/other';
import * as Location from 'expo-location';
import OverlayLoading from '../OverlayLoading';
import CardUpRounded from '../CardUpRounded';
import MyLinearGradient from '../gradient/MyLinearGradient';
import { Button, ButtonSpinner, ButtonText } from '../ui/button';
import MyMapView from '../MyMapView';
import { debounce } from '@/utils/functions/help';
import { useTranslation } from 'react-i18next';

interface AddressSearchProps {
isOpen: boolean;
onClose: () => void;
setAddress: React.Dispatch<React.SetStateAction<Address | null>>;
}

const dummyData = {"description": "Nestroyplatz, Vienna, Austria", "matched_substrings": [{"length": 3, "offset": 0}], "place_id": "Eh1OZXN0cm95cGxhdHosIFZpZW5uYSwgQXVzdHJpYSIuKiwKFAoSCfHc0pAJB21HEQb8AFO9-yd-EhQKEgmfyjZRngdtRxFGW6JRiuXC_Q", "reference": "Eh1OZXN0cm95cGxhdHosIFZpZW5uYSwgQXVzdHJpYSIuKiwKFAoSCfHc0pAJB21HEQb8AFO9-yd-EhQKEgmfyjZRngdtRxFGW6JRiuXC_Q", "structured_formatting": {"main_text": "Nestroyplatz", "main_text_matched_substrings": [[Object]], "secondary_text": "Vienna, Austria"}, "terms": [{"offset": 0, "value": "Nestroyplatz"}, {"offset": 14, "value": "Vienna"}, {"offset": 22, "value": "Austria"}], "types": ["route", "geocode"]}

const AddressSearch = ({ isOpen, onClose, setAddress }: AddressSearchProps) => {
    const { appliedTheme } = useTheme();
    const { t } = useTranslation();
    const [query, setQuery] = useState('');
    const [results, setResults] = useState<GooglePlace[]>([]);
    const [isListLoading, setIsListLoading] = useState(false);
    const [isGlobalLoading, setIsGlobalLoading] = useState(false);
    const [firstResult, setFirstResult] = useState<GooglePlace | null>(null);
    const [selectedAddress, setSelectedAddress] = useState<Address | null>(null);
    const [mapRegion, setMapRegion] = useState({
        latitude: 32.0853,
        longitude: 34.7818,
        latitudeDelta: 0.03,
        longitudeDelta: 0.03,
    });
    const isActive = !!selectedAddress?.subpremise;
    const scrollViewRef = useRef<FlatList>(null);

    useEffect(() => {
        if(!selectedAddress) return;
        const keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', () => {
            setTimeout(() => {
                scrollViewRef.current?.scrollToEnd({ animated: true });
            }, 10); // Delay to make sure scroll works
        });
    
        return () => keyboardDidShowListener.remove();
    }, [selectedAddress]);

    // Debounce search
    const debouncedSearch = useCallback(
        debounce(async (text) => {
        if (text.trim().length > 2) {
            setIsListLoading(true);
            try {
                const places: GooglePlace[] = await fetchAutocomplete(text);
                setResults(places.slice(0, 4));
                if (places.length > 0)
                    handleShowOnMap(places[0]);
            } catch (error) {
                console.log('Error fetching autocomplete:', error);
                setResults([]);
            } finally {
                setIsListLoading(false);
            }
        } else {
            setResults([]);
        }
        }, 300),
        []
    );
    // Handle search input
    const handleChange = async (text: string) => {
        setQuery(text);
        debouncedSearch(text);
    };
    // handle show place on map
    const handleShowOnMap = useCallback(async (place: GooglePlace) => {
        // Only set firstResult if it's different from current
        if (!firstResult || firstResult.place_id !== place.place_id) {
            setFirstResult(place);
        }
        
        try {
            const results = await getPlaceIdDetails(place.place_id);
            const coords = results.geometry.location ? 
                { lat: results.geometry.location.lat, lng: results.geometry.location.lng } as coords : undefined;
            
            if (coords) {
                setMapRegion(prev => {
                // Only update if coordinates changed
                if (prev.latitude !== coords.lat || prev.longitude !== coords.lng) {
                    return {
                    latitude: coords.lat,
                    longitude: coords.lng,
                    latitudeDelta: 0.03,
                    longitudeDelta: 0.03,
                    };
                }
                return prev;
                });
            }
            return { coords, address_components: results.address_components };
        } catch (error) {
            console.error('Error fetching place coordinates:', error);
        }
    }, [firstResult]);

    // handle select place
    const handleSelectPlace = async (place: GooglePlace) => {
        const { coords, address_components } = await handleShowOnMap(place) || {};
        let street = '', city = '', country = '', postal = '';

        for (let component of address_components) {
            const types = component.types;
            
            if (types.includes('street_number') && types.includes('route')) {
                street = `${component.long_name} ${street}`;
            } else if (types.includes('locality')) {
                city = component.long_name;
            } else if (types.includes('country')) {
                country = component.long_name;
            }

            if(types.includes('postal_code')) {
                postal = component.long_name || null;
            }
        }

        setSelectedAddress({
            place_id: firstResult?.place_id,
            street: firstResult?.structured_formatting.main_text,
            city,
            country,
            postal,
            coords
        });
    };

    // handle get current location
    const getLocation = async () => {
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
            console.log('Permission to access location was denied');
            return;
        }
        setIsGlobalLoading(true);
        // Get current location
        let userLocation = await Location.getCurrentPositionAsync({});
    
        // Get address using reverse geocoding
        const { latitude, longitude } = userLocation.coords;
        setMapRegion({
            latitude: latitude,
            longitude: longitude,
            latitudeDelta: 0.03,
            longitudeDelta: 0.03,
        })
        const geocode = await Location.reverseGeocodeAsync({ latitude, longitude });
        
        if (geocode.length > 0) {
            const address: Address = {
                street: geocode[0].street || undefined,
                country: geocode[0].country || undefined,
                city: geocode[0].city || undefined,
                postal: geocode[0].postalCode || undefined,
                coords: {
                    lat: latitude,
                    lng: longitude,
                },
            };
            setSelectedAddress(address);
        }
        setIsGlobalLoading(false);
    };
    
    // handle submit
    const handleSubmit = () => {
        setSelectedAddress(null);
        setAddress(selectedAddress);
        onClose();
    }

    return (
        <Actionsheet isOpen={isOpen} onClose={onClose} snapPoints={[!selectedAddress ? 90 : 95]} className='' >
            <ActionsheetBackdrop />

            <FlatList
            ref={scrollViewRef}
            data={[{}]}
            keyExtractor={(_, index) => String(index)}
            renderItem={() =>
                <ActionsheetContent className={`bg-background-${appliedTheme} px-0`}>
                    <ActionsheetDragIndicatorWrapper>
                        <ActionsheetDragIndicator />
                    </ActionsheetDragIndicatorWrapper>

                    {isGlobalLoading && <OverlayLoading />}

                    {!selectedAddress ?
                    // Not Selected Address
                    <>
                        {/* Title */}
                        <Text className={`text-text-${appliedTheme} font-bold my-2 text-lg`}>
                            {t('addressSearch.searchAddress')}
                        </Text>
                        <Box className="w-full flex-1 pb-10 gap-2">
                            {/* Search Input */}
                            <InputAuth
                                value={query}
                                onChangeText={handleChange}
                                placeholder={t('addressSearch.streetNameOnly')} // Translate "Street name only (no city or country)"
                                className="px-6"
                                classNameInput={`bg-buttonDisable-${appliedTheme}`}
                            />
                            <Box className="px-6 -mt-2 mb-2">
                                <TouchableOpacity
                                    className="flex-row items-center gap-2"
                                    onPress={getLocation}
                                    activeOpacity={0.6}
                                >
                                    <IC_CurrentLocation className="w-5 h-5" />
                                    <Text className="text-lg font-semibold text-purple-500">{t('addressSearch.currentLocation')}</Text>
                                </TouchableOpacity>
                            </Box>
                            {/* Map + Marker */}
                            <Box className="h-[170px] w-full">
                                <MyMapView 
                                    mapRegion={mapRegion} 
                                    showMarker={!!firstResult}
                                    markerTitle={firstResult?.structured_formatting.main_text || ""}
                                />
                            </Box>

                            {/* Result list */}
                            <Box className="flex-1 py-4 px-6">
                                <Text className={`text-2xl font-bold text-text-${appliedTheme} mb-1`}>Address</Text>
                                {isListLoading && <Text>{t('addressSearch.loading')}</Text>}
                                <FlatList
                                    data={results}
                                    keyExtractor={(item, idx) => item.place_id + idx}
                                    renderItem={({ item: place }) => (
                                        <TouchableOpacity
                                            className="flex-row items-center rounded-lg py-4"
                                            onPress={() => handleSelectPlace(place)}
                                            activeOpacity={0.6}
                                        >
                                            <IC_MapMarker className="w-7 h-7" />
                                            <Box className="flex-1 ml-3">
                                                <Text className={`text-base font-semibold text-text-${appliedTheme}`}>
                                                    {place.structured_formatting.main_text}
                                                </Text>
                                                <Text className={`text-sm text-subTextGray-${appliedTheme}`}>
                                                    {place.structured_formatting.secondary_text}
                                                </Text>
                                            </Box>
                                            <IC_ChevronRight className="w-4 h-4" color="#5C616F" />
                                        </TouchableOpacity>
                                    )}
                                    ListEmptyComponent={
                                        !query ? <Text>{t('addressSearch.startSearching')}</Text> :
                                        !isListLoading ? <Text>{t('addressSearch.noResultsFound')}</Text> : null
                                    }
                                    ItemSeparatorComponent={() => <Divider className="mx-2" />}
                                    showsVerticalScrollIndicator={false}
                                    removeClippedSubviews={true}
                                    maxToRenderPerBatch={5}
                                    windowSize={5}
                                />
                            </Box>
                        </Box>
                    </>
                    :
                    // Selected Address
                    <>
                        <Pressable
                            className={`absolute top-8 left-4 z-10 h-10 w-10 items-center justify-center rounded-full bg-card-${appliedTheme}`}
                            onPress={() => setSelectedAddress(null)}
                        >
                            <IC_ChevronLeft className="h-5 w-5" color={appliedTheme==="dark"? 'white' : "black"}/>
                        </Pressable>
                        <Box className="h-[300px] w-full flex-1">
                            <MyMapView 
                                mapRegion={mapRegion} 
                                showMarker={!!selectedAddress}
                                markerTitle={[selectedAddress.city,selectedAddress.street].join(" ") || ""}
                            />
                        </Box>
                        <CardUpRounded className="gap-2">
                            <Box className="gap-2">
                                <Text className={`text-3xl text-text-${appliedTheme} font-bold`}>{t('addressSearch.addressDetail')}</Text>
                                <Text className={`text-subText-${appliedTheme} text-lg`}>
                                    {t('addressSearch.aptSuiteNumber')}
                                </Text>
                            </Box>
                            {/* Inputs */}
                            <InputAuth
                                classNameInput={`border border-inputPlaceholderText-${appliedTheme}`}
                                value={[selectedAddress.street, selectedAddress.city, selectedAddress.country].join(", ")}
                                onChangeText={() => {}}
                                placeholder={t('addressSearch.streetAddress')}
                                isReadOnly={true}
                            />
                            <InputAuth
                                classNameInput={`border border-inputPlaceholderText-${appliedTheme}`}
                                value={selectedAddress.subpremise || ""}
                                onChangeText={(val) => setSelectedAddress((prev) => ({ ...prev!, subpremise: val }))}
                                placeholder={t('addressSearch.aptSuiteNumberPlaceholder')}
                            />
                            {/* Submit Button */}
                            <MyLinearGradient type="button" color={isActive ? "purple" : "disabled-button"}>
                                <Button
                                    onPress={() => (isActive ? handleSubmit() : null)}
                                    className="w-full"
                                    style={{ backgroundColor: "initial" }}
                                >
                                    <ButtonText className={isActive ? `text-buttonText-${appliedTheme}` : `text-buttonDisableText-${appliedTheme}`}>
                                        {t('addressSearch.continueButton')}
                                    </ButtonText>
                                </Button>
                            </MyLinearGradient>
                        </CardUpRounded>
                    </>
                    }
                </ActionsheetContent>
            }
            contentContainerStyle={{ flexGrow: 1, paddingBottom: 20 }}
            keyboardShouldPersistTaps="handled"
        />
        </Actionsheet>
    );
};

export default AddressSearch;

