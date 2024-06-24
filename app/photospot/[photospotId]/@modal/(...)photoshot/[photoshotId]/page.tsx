import { Modal } from "@/components/common/modal";
import TimelineDialogCard from "@/components/homePage/timelineDialogCard";

export default function PhotoshotModal({ params: { photoshotId } }: { params: { photoshotId: string } }) {
    return (<Modal>
        <TimelineDialogCard photoshotId={parseInt(photoshotId)} />
    </Modal>
    );
}