import { Card, CardContent } from "../ui/card";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "../ui/carousel";

export default function ImageCarousel({ photos }: { photos: string[] }) {
    console.log('photos', photos);
    return (
        <Carousel className=" content-center justify-center w-[300px] max-w-xs"
            opts={{
                align: "start",
                loop: true,
            }}
        >
            <CarouselContent>
                {photos.map((photo_src, index) => (
                    <CarouselItem key={index}>
                        <div className="p-1 w-full">
                            <Card className="w-full">
                                <img className="w-full h-[300px] object-cover rounded-md" src={photo_src} />
                            </Card>
                        </div>
                    </CarouselItem>
                ))}
            </CarouselContent>
            {photos.length > 1 && <CarouselPrevious />}
            {photos.length > 1 && <CarouselNext />}
        </Carousel>
    )
}