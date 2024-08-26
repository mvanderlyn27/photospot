"use client";
import { cn } from "@/lib/utils";
import { animated, useSpring } from "@react-spring/web";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { useEffect, useRef, useState } from "react";
import { Map as MapboxMap, Marker, NavigationControl } from "react-map-gl";
import { Button, buttonVariants } from "../ui/button";
import { FaDirections } from "react-icons/fa";
import { Card } from "../ui/card";
import { Photospot } from "@/types/photospotTypes";
import { Skeleton } from "../ui/skeleton";
import { useQuery } from "@supabase-cache-helpers/postgrest-swr";
import { getPhotospotById } from "@/app/supabaseQueries/photospot";
import PhotospotDirectionsButton from "../photospot/photospotDirectionsButton";
import useSWR from "swr";
import { fetcher } from "@/utils/common/fetcher";

export default function PreviewMap({ id }: { id: number }) {
  const mapBoxToken = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN ? process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN : "";
  // const [runAnimation, setRunAnimation] = useState(true);
  const [bearing, setBearing] = useState(0);
  const [mapLoaded, setMapLoaded] = useState(false);
  const mapRef = useRef<any>(null);
  // function rotateCamera(timestamp: number) {
  //     // clamp the rotation between 0 -360 degrees
  //     // Divide timestamp by 100 to slow rotation to ~10 degrees / sec
  //     mapRef.current?.rotateTo((timestamp / 100) % 360, { duration: 0 });
  //     // Request the next frame of the animation.
  //     requestAnimationFrame(rotateCamera);
  // }
  // const handleLoad = (e: mapboxgl.MapboxEvent) => {
  //     const map = e.target;
  //     rotateCamera(0);
  // }
  // useEffect(() => {
  //     return () => {
  //         if (runAnimation == true) {
  //             rotateCamera(0)
  //         }

  //     };
  // }, [runAnimation]);
  const {
    data: photospot,
    isLoading: photospotLoading,
    error: photospotError,
  } = useSWR("/api/photospot/" + id, fetcher);

  const initialMapState = {
    zoom: 16,
    bearing: 29,
    pitch: 0,
  };
  const handleDirections = () => {
    if (photospot) {
      window.open(`https://www.google.com/maps?q=${photospot.lat},${photospot.lng}`);
    }
  };
  const handleReset = () => {
    if (mapRef.current && photospot) {
      mapRef.current.flyTo({
        pitch: initialMapState.pitch,
        bearing: initialMapState.bearing,
        zoom: initialMapState.zoom,
        center: [photospot.lng, photospot.lat],
      });
    }
  };
  const handleMapLoad = (e: mapboxgl.MapboxEvent) => {
    console.log("handleMapLoad", e);
    setMapLoaded(true);
  };
  const toStreetAddress = (address: string): string => {
    //shortents to street, city address
    const address_ar = address.split(",");
    if (address_ar.length > 1) {
      return address_ar[0] + ", " + address_ar[1];
    } else if (address_ar.length == 1) {
      return address_ar[0];
    } else {
      return "";
    }
  };
  return (
    <div className="w-full h-full">
      {photospot && (
        <Card className="w-full h-full flex flex-col relative ">
          <div className={`flex-0 p-4 flex flex-row justify-between items-center ${mapLoaded ? "" : "invisible"}`}>
            <h1 className="text-xl ">
              {toStreetAddress(photospot.address != "" ? photospot.address : photospot.location_name)}
            </h1>
            <div className="flex flex-row gap-4">
              <Button onClick={handleReset}>Reset</Button>
              <PhotospotDirectionsButton id={id} />
            </div>
          </div>
          <div className={`w-full flex-1 ${mapLoaded ? "" : "invisible"}`}>
            <MapboxMap
              reuseMaps={true}
              // longitude={lng}
              // latitude={lat}
              initialViewState={{
                zoom: 16,
                bearing: 29,
                pitch: 0,
                latitude: photospot.lat,
                longitude: photospot.lng,
              }}
              dragRotate={true}
              onDrag={(e) => {}}
              scrollZoom={false}
              // zoom={18}
              // pitch={60}
              // onLoad={handleLoad}
              mapStyle="mapbox://styles/mvanderlyn27/clc8gyohu000114pl9hy6zzdt"
              mapboxAccessToken={mapBoxToken}
              onLoad={(e) => {
                handleMapLoad(e);
              }}
              ref={mapRef}>
              <Marker longitude={photospot.lng} latitude={photospot.lat} anchor="bottom">
                <img className="w-10 h-10" src="/selectedPin.svg" />
              </Marker>
              <NavigationControl />
            </MapboxMap>
          </div>

          <Skeleton
            className={`bg-slate-800/10 absolute top-0 bottom-0 right-0 left-0 ${!mapLoaded ? "" : "invisible"}`}
          />
        </Card>
      )}
      {photospotLoading && <Skeleton className="bg-black/10 w-full h-full" />}
    </div>
  );
}
