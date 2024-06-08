"use client";
import LeftWindow from "@/components/create-page/left-window";
import PhotospotMap from "@/components/maps/map";
import { useEffect, useRef, useState } from "react";
import { listAllPhotospots } from "../serverActions/photospots/listAllPhotospots";
import { NewPhotospotInfo, Photospot } from "@/types/photospotTypes";
import { createClient } from "@/utils/supabase/client";
import { User } from "@supabase/supabase-js";
import { useRouter } from "next/navigation";
import { LngLat, LngLatBounds } from "mapbox-gl";
// import mapboxgl from 'mapbox-gl';
const INITIAL_LAT: number = 40.72377;
const INITIAL_LNG: number = -73.99837;
export default function CreatePage() {
  //move selected lat/lng up to here
  // can click in map to update selected position being passed down, or search via geocoder in the lefwindow
  // both will update the parent, and propogate to other child
  const router = useRouter();
  //photospot related states
  const [selectedLocation, setSelectedLocation] = useState<
    Photospot | NewPhotospotInfo | null
  >(null);
  const [loadingSelectedLocation, setLoadingSelectedLocation] = useState(false);
  const [photospots, setPhotospots] = useState<Photospot[]>([]);
  //user state
  const [user, setUser] = useState<User | null>(null);
  //map related states
  const [mapCenter, setMapCenter] = useState<LngLat>(
    new LngLat(INITIAL_LNG, INITIAL_LAT)
  );
  const [mapBounds, setMapBounds] = useState<LngLatBounds | null>(null);
  const [mapLoaded, setMapLoaded] = useState(false);

  const supabase = createClient();
  const refreshPhotospots = () => {
    //eventually want to get this in reference to the user's frame, only load locations within their view
    // if we try a new location in an area that isn't loaded yet, could cause issues
    listAllPhotospots().then((photospots) => {
      setPhotospots(photospots);
    });
    supabase.auth.getUser().then((user) => {
      if (!user.data.user) {
        router.push("/login");
      }
      setUser(user.data.user);
    });
  };
  useEffect(() => {
    refreshPhotospots();
  }, [mapLoaded]);
  return (
    <div className="h-[calc(100vh-64px)] w-screen">
      <div className="absolute top-[64px] left-0 lg:w-[450px] max-h-[calc(100vh-64px)] pl-4 pt-4 z-50">
        <LeftWindow
          mapBounds={mapBounds}
          mapCenter={mapCenter}
          user={user}
          setSelectedLocation={setSelectedLocation}
          selectedLocation={selectedLocation}
          refreshPhotospots={refreshPhotospots}
          loadingSelectedLocation={loadingSelectedLocation}
        />
      </div>
      <div className="h-full w-full">
        <PhotospotMap
          setMapBounds={setMapBounds}
          setMapLoaded={(val: boolean) => setMapLoaded(val)}
          mapCenter={mapCenter}
          setMapCenter={setMapCenter}
          selectedLocation={selectedLocation}
          setSelectedLocation={setSelectedLocation}
          photospots={photospots}
          setLoadingSelectedLocation={setLoadingSelectedLocation}
          loadingSelectedLocation={loadingSelectedLocation}
        />
      </div>
    </div>
  );
}
