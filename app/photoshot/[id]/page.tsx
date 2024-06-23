import { Modal } from "@/components/common/modal";
import TimelineDialogCard from "@/components/homePage/timelineDialogCard";
import { Dialog } from "@/components/ui/dialog";

export default function Photoshot({ params: { id } }: { params: { id: string } }) {
    return (
        <Dialog>

            <TimelineDialogCard photoshotId={parseInt(id)} />
        </Dialog>

    );
}