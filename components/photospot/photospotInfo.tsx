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
        <Card className="h-full">
            <CardHeader className="flex-none">
                <CardTitle className="text-2xl">{photospot?.name}</CardTitle>
                <CardDescription>Rating: 3.5/5</CardDescription>
                <div className=" flex flex-auto gap-2">
                    <Badge variant="outline">Golden Hour</Badge>
                    <Badge variant="outline">Dating App</Badge>
                    <Badge variant="outline">Headshot</Badge>
                </div>
            </CardHeader>
            <CardContent className="flex flex-col gap-4 ">
                <div className="flex-1">
                    <h2>
                        <b>A bit more about this spot:</b> {photospot?.description}
                    </h2>
                </div>
                <div className="flex-none">
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
