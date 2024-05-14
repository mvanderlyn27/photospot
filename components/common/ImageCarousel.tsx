import { Card, CardContent } from "../ui/card";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "../ui/carousel";

export default function ImageCarousel({ photos, width, height }: { photos: string[], width: string, height: string }) {
    console.log('photos', photos);
    return (
        <Carousel className={`content-center justify-center w-[${width}] h-[${height}]`}
            opts={{
                align: "start",
                loop: true,
            }}
        >
            <CarouselContent>
                {photos.map((photo_src, index) => (
                    <CarouselItem key={index} className="">
                        <img className={`w-full h-[${height}] object-cover rounded-md`} src={photo_src} />
                    </CarouselItem>
                ))}
            </CarouselContent>
            {photos.length > 1 && <CarouselPrevious />}
            {photos.length > 1 && <CarouselNext />}
        </Carousel>
    )
}