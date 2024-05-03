import { Map as MapboxMap, GeolocateControl, NavigationControl } from "react-map-gl";
import 'mapbox-gl/dist/mapbox-gl.css';

export default function Map() {
    const mapBoxToken = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN ? process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN : "";
    //setup to take options for widht/height
    return (
        <div className="flex h-[calc(100vh-4rem)] w-screen w-screen">
            <MapboxMap
                initialViewState={{
                    longitude: -73.961321,
                    latitude: 40.766676,
                    zoom: 13
                }}
                style={{ flex: '1 1 0' }}
                mapStyle="mapbox://styles/mvanderlyn27/clc8gyohu000114pl9hy6zzdt/draft"
                mapboxAccessToken={mapBoxToken}
            >
                <GeolocateControl position="top-left" />
                <NavigationControl position="top-left" />
            </MapboxMap>
        </div>)

}