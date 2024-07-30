"use client";
import {
  Map as MapboxMap,
  GeolocateControl,
  NavigationControl,
  Marker,
  useMap,
} from "react-map-gl";
import mapboxgl, { LngLatBounds } from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";

import { distanceOnGlobe } from "@/utils/common/math";
import { NewPhotospotInfo, Photospot } from "@/types/photospotTypes";
import useSWR from "swr";
import { fetcher } from "@/utils/common/fetcher";
import { GeocodingCore } from "@mapbox/search-js-core";
import { useTheme } from "next-themes";
import { isPhotoshot } from "@/utils/common/typeGuard";
const MINIMUM_PHOTOSPOT_DISTANCE = 2;
// A circle of 5 mile radius of the Empire State Building
const MAXBOUNDS = new LngLatBounds([-74.104, 39.98], [-73.82, 40.9]);
export default function PhotospotMap({
  selectedLocation,
  setSelectedLocation,
  viewState,
  setViewState,
  handlePhotospotTooClose,
}: {
  selectedLocation: Photospot | NewPhotospotInfo | null;
  setSelectedLocation: any;
  viewState: any;
  setViewState: any;
  handlePhotospotTooClose?: any;
}) {
  //api keys
  const mapBoxToken = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN
    ? process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN
    : "";
  const geocode = new GeocodingCore({ accessToken: mapBoxToken });
  mapboxgl.accessToken = mapBoxToken;
  //state
  const { theme } = useTheme();
  const { data: photospots, isLoading: isLoadingPhotospots } = useSWR(
    "/api/photospot",
    fetcher
  );
  const { photospotMap } = useMap();
  //hooks
  // useEffect(() => {
  //   if (selectedLocation && photospotMap) {
  //     photospotMap.flyTo({
  //       center: [selectedLocation.lng, selectedLocation.lat],
  //     });
  //   }
  // }, [selectedLocation, photospotMap]);
  const selectLocation = async (
    e: any,
    loc: { lat: number; lng: number },
    photospot: Photospot | null
  ) => {
    e.originalEvent.stopPropagation();
    if (photospot) {
      setSelectedLocation(photospot);
    } else if (handlePhotospotTooClose) {
      // see if any locations are too close
      const photospotsTooClose: Photospot[] = [];
      photospots.forEach((photospot: Photospot) => {
        const dist = distanceOnGlobe(
          { lat: loc.lat, lng: loc.lng },
          { lat: photospot.lat, lng: photospot.lng }
        );
        if (dist < MINIMUM_PHOTOSPOT_DISTANCE) {
          photospotsTooClose.push(photospot);
        }
      });
      if (photospotsTooClose.length > 0) {
        handlePhotospotTooClose(photospotsTooClose);
        return;
      }
      //otherwise reverse-geocode, and update selectedLocation
      const reverseGeocode = await geocode.reverse({
        lat: loc.lat,
        lng: loc.lng,
      });
      if (reverseGeocode.features) {
        const newPhotospotInfo = {
          location_name: reverseGeocode.features[0].properties.name_preferred
            ? reverseGeocode.features[0].properties.name_preferred
            : reverseGeocode.features[0].properties.name,
          address: reverseGeocode.features[0].properties.full_address,
          neighborhood:
            reverseGeocode.features[0].properties.context.neighborhood?.name,
          lat: e.lngLat.lat,
          lng: e.lngLat.lng,
        } as NewPhotospotInfo;
        setSelectedLocation(newPhotospotInfo);
      }
    }
  };
  return (
    <MapboxMap
      maxBounds={MAXBOUNDS}
      id="photospotMap"
      initialViewState={{
        ...viewState,
      }}
      reuseMaps={true}
      mapStyle={
        theme && theme === "dark"
          ? "mapbox://styles/mapbox/dark-v11"
          : "mapbox://styles/mvanderlyn27/clc8gyohu000114pl9hy6zzdt"
      }
      // mapStyle="mapbox://styles/mapbox/standard"
      mapboxAccessToken={mapBoxToken}
      cursor="auto"
      onClick={(e) => selectLocation(e, e.lngLat, null)}
      onMoveEnd={(e) => {
        setViewState({ ...viewState, ...e.target.getCenter() });
      }}
    >
      {selectedLocation && !isPhotoshot(selectedLocation) && (
        <Marker
          longitude={selectedLocation.lng}
          latitude={selectedLocation.lat}
          anchor="bottom"
          onClick={(e) => {
            e.originalEvent.stopPropagation();
            setSelectedLocation(null);
          }}
        >
          <img className="w-10 h-10" src="/selectedPin.svg" />
        </Marker>
      )}
      {photospots &&
        photospots.map((photospot: Photospot) => {
          return (
            <Marker
              key={photospot.id}
              longitude={photospot.lng}
              latitude={photospot.lat}
              anchor="bottom"
              onClick={(e) => {
                selectLocation(
                  e,
                  { lng: photospot.lng, lat: photospot.lat },
                  photospot
                );
              }}
            >
              {selectedLocation &&
              isPhotoshot(selectedLocation) &&
              selectedLocation.id === photospot.id ? (
                <img
                  key={photospot.id}
                  className="w-10 h-10"
                  src="/selectedPin.svg"
                />
              ) : (
                <img key={photospot.id} className="w-10 h-10" src="/pin.svg" />
              )}
            </Marker>
          );
        })}
      <GeolocateControl position="bottom-right" showAccuracyCircle={false} />
      {/* <NavigationControl position="top-right" /> */}
    </MapboxMap>
  );
}
