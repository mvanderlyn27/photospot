import { Map as MapboxMap, GeolocateControl, NavigationControl, Marker, useMap } from "react-map-gl";
import 'mapbox-gl/dist/mapbox-gl.css';
import { useRef } from "react";
// import { Pin } from '@/media/pin.tsx';

export default function Map({ location, setLocation }: { location: { lat: number, lng: number }, setLocation: any }) {
    const mapBoxToken = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN ? process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN : "";
    //setup to take options for widht/height
    //allow set location to work for clicking on a location
    const mapRef = useRef<any>(null);

    const handleClick = (e: any) => {
        console.log('setLocation', e);

        mapRef.current.flyTo({ center: [e.lngLat.lng, e.lngLat.lat], })
        setLocation({ lat: e.lngLat.lat, lng: e.lngLat.lng });
    }
    return (
        // <div className="flex h-[calc(100vh-4rem)] w-screen w-screen">
        <MapboxMap
            initialViewState={{
                longitude: location ? location.lng : -73.961321,
                latitude: location ? location.lat : 40.766676,
                zoom: 13
            }}
            style={{ flex: '1 1 0' }}
            reuseMaps={true}
            mapStyle="mapbox://styles/mvanderlyn27/clc8gyohu000114pl9hy6zzdt?optimize=true"
            mapboxAccessToken={mapBoxToken}
            onClick={(e) => handleClick(e)}
            ref={mapRef}
        >
            {location && <Marker
                longitude={location.lng}
                latitude={location.lat}
            >
                <img className="w-10 h-10" src='/pin.svg' />
            </Marker>
            }
            <GeolocateControl position="top-right" />
            <NavigationControl position="top-right" />
        </MapboxMap>
        // </div>
    )

}