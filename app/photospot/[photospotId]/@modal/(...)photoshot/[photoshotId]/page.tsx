import { Modal } from "@/components/common/modal";
import PhotoshotCard from "@/components/homePage/photoshotCard";

export default function PhotoshotModal({
  params: { photoshotId },
}: {
  params: { photoshotId: string };
}) {
  return (
    <Modal>
      <PhotoshotCard photoshotId={parseInt(photoshotId)} />
    </Modal>
  );
}
