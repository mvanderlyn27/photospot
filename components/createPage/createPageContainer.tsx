"use client";
import LeftWindow from "@/components/createPage/leftWindow";
import PhotospotMap from "@/components/maps/map";
import { useRef, useState } from "react";
import { NewPhotospotInfo, Photospot } from "@/types/photospotTypes";
import { MapProvider } from "react-map-gl";
import PhotospotsTooCloseDialog from "@/components/createPage/photospotsTooCloseDialog";
import { Card, CardContent } from "../ui/card";
import AutoComplete from "../maps/autocomplete";
import PhotospotPreview from "./photospotPreview";
import { Button } from "../ui/button";
import { useBreakpoint } from "@/hooks/tailwind";
import { MdOutlineClear } from "react-icons/md";
import { Drawer, DrawerClose, DrawerContent, DrawerFooter, DrawerTrigger } from "../ui/drawer";
import { FaLocationCrosshairs } from "react-icons/fa6";
// import mapboxgl from 'mapbox-gl';
const INITIAL_LAT: number = 40.72377;
const INITIAL_LNG: number = -73.99837;
export default function CreatePageContainer() {
  //photospot related states
  const [viewState, setViewState] = useState({
    longitude: INITIAL_LNG,
    latitude: INITIAL_LAT,
    zoom: 13,
    bearing: 29,
  });
  const [selectedLocation, setSelectedLocation] = useState<Photospot | NewPhotospotInfo | null>(null);
  const [closestPhotospots, setClosestPhotospots] = useState<Photospot[]>([]);
  const [photospotsTooCloseDialogOpen, setPhotospotsTooCloseDialogOpen] = useState<boolean>(false);
  const handlePhotospotTooClose = (photospots: Photospot[]) => {
    setClosestPhotospots(photospots);
    setPhotospotsTooCloseDialogOpen(true);
  };
  let geoLocationRef = useRef(null);
  const isSmall = useBreakpoint("sm");
  return (
    <div className="h-[calc(100vh-64px)] w-screen">
      <MapProvider>
        <div
          className={`absolute top-[64px] ${
            !isSmall.isSm ? "w-full" : "w-auto"
          } left-0 lg:w-[450px] max-h-[calc(100vh-64px)] pl-4 pr-4 pt-4 z-50`}>
          <Card className="">
            <CardContent className="p-4 flex flex-col gap-4 ">
              <div className="flex flex-row gap-2 w-full">
                <AutoComplete setSelectedLocation={setSelectedLocation} selectedLocation={selectedLocation} />
                <Button
                  variant="default"
                  onClick={() => {
                    if (geoLocationRef.current) (geoLocationRef.current as any).trigger();
                  }}>
                  <FaLocationCrosshairs className="w-6 h-6 md:w-8 md:h-8" />
                </Button>
              </div>
              {selectedLocation && isSmall.isSm && <PhotospotPreview selectedLocation={selectedLocation} />}
            </CardContent>
          </Card>
        </div>
        <Drawer
          open={selectedLocation !== null && !isSmall.isSm}
          onClose={() => setSelectedLocation(null)}
          modal={false}
          handleOnly={true}>
          <div className="h-full w-full">
            <PhotospotMap
              viewState={viewState}
              setViewState={setViewState}
              selectedLocation={selectedLocation}
              setSelectedLocation={setSelectedLocation}
              handlePhotospotTooClose={handlePhotospotTooClose}
              geoLocationRef={geoLocationRef}
            />
          </div>
          <PhotospotsTooCloseDialog
            photospots={closestPhotospots}
            photospotsTooCloseDialogOpen={photospotsTooCloseDialogOpen}
            setPhotospotsTooCloseDialogOpen={setPhotospotsTooCloseDialogOpen}
            setSelectedLocation={setSelectedLocation}
          />

          <DrawerContent className="h-[55vh]">
            {selectedLocation && <PhotospotPreview selectedLocation={selectedLocation} />}
            <Button className="absolute top-0 right-0 p-0" variant="ghost" onClick={() => setSelectedLocation(null)}>
              <MdOutlineClear className="w-8 h-8 stroke-white" />
            </Button>
          </DrawerContent>
        </Drawer>
      </MapProvider>
    </div>
  );
}
