import { Photospot } from "@/types/photospotTypes";
import { Dialog, DialogContent } from "../ui/dialog";
import { DialogTitle } from "@radix-ui/react-dialog";
import { DefaultPhotospot } from "@/utils/common/imageLinks";
import { Button } from "../ui/button";

export default function PhotospotsTooCloseDialog({ photospots, photospotsTooCloseDialogOpen, setPhotospotsTooCloseDialogOpen, setSelectedLocation }: { photospots: Photospot[], photospotsTooCloseDialogOpen: boolean, setPhotospotsTooCloseDialogOpen: any, setSelectedLocation: any }) {
    const handleSelect = () => {
        setSelectedLocation(photospots[0]);
        setPhotospotsTooCloseDialogOpen(false);
    }
    return (
        <Dialog open={photospotsTooCloseDialogOpen} onOpenChange={setPhotospotsTooCloseDialogOpen}>
            <DialogContent>
                <DialogTitle>
                    <h1 className="text-2xl">Too close to another photospot</h1>
                </DialogTitle>
                {photospots.length > 0 &&
                    <div className="flex flex-col gap-4">
                        <h2> Did you mean to select {photospots[0].location_name}?</h2>
                        <img src={photospots[0].top_photo_path ? photospots[0].top_photo_path : DefaultPhotospot}></img>
                        <div className="flex flex-row justify-center gap-4">
                            <Button variant="destructive">Cancel</Button>
                            <Button onClick={handleSelect}>Select</Button>
                        </div>
                    </div>}
            </DialogContent>
        </Dialog>
    )
}