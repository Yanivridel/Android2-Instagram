import React from 'react';
import MapView, { Marker } from 'react-native-maps';
import { Box } from './ui/box';
import { cn } from './ui/cn';
import { IC_MapMarker, IC_MapMarker2 } from '@/utils/constants/Icons';

interface MyMapViewProps {
    mapRegion: {
        latitude: number;
        longitude: number;
        latitudeDelta: number;
        longitudeDelta: number;
    };
    markerTitle?: string;
    showMarker?: boolean;
    styleMap?: any;
    className?: string;
    rest?: any;
}

const MyMapView = ({className, mapRegion, markerTitle, showMarker = false, styleMap, ...rest }: MyMapViewProps) => {
    return (
    <Box className={cn("flex-1", className)}>
        <MapView
            style={{ width: "100%", height: "100%", ...styleMap }}
            region={mapRegion}
            {...rest}
        >
            {showMarker && (
            <Marker
                coordinate={{
                latitude: mapRegion.latitude,
                longitude: mapRegion.longitude,
                }}
                title={markerTitle || ""}
            >
                <IC_MapMarker2 className='w-20 h-20'/>
            </Marker>
            )}
        </MapView>
    </Box>
    );
};

export default MyMapView;