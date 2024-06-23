import { Modal } from "@/components/common/modal";
import TimelineDialogCard from "@/components/homePage/timelineDialogCard";

export default function Photoshot({ params: { id } }: { params: { id: string } }) {
    return (<Modal>
        <TimelineDialogCard photoshotId={parseInt(id)} />
    </Modal>
    );
}