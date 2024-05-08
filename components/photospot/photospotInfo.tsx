import { PhotoTime, Photospot } from "@/types/photospotTypes";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import GoldenHourDisplay from "./goldenHourDisplay";
import { Badge } from "../ui/badge";

export default function PhotospotInfo({
  photospot,
}: {
  photospot: Photospot | null;
}) {
  return (
    <Card className="m-8">
      <CardHeader>
        <CardTitle className="text-2xl">{photospot?.name}</CardTitle>
        <CardDescription>Rating: 3.5/5</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-4">
          <div className="flex flex-auto gap-2">
            <Badge variant="outline">Golden Hour</Badge>
            <Badge variant="outline">Dating App</Badge>
            <Badge variant="outline">Headshot</Badge>
          </div>
          <h2>
            <b>A bit more about this spot:</b> {photospot?.description}
          </h2>
          <GoldenHourDisplay
            lat={photospot?.lat}
            lng={photospot?.lng}
            photoTypes={[
              PhotoTime.golden_hour_morning,
              PhotoTime.golden_hour_evening,
            ]}
          />
        </div>
      </CardContent>
    </Card>
  );
}
