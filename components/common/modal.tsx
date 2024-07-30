"use client";

import { Dialog, DialogOverlay, DialogContent } from "../ui/dialog";
import { useRouter } from "next/navigation";

export function Modal({ children }: { children: React.ReactNode }) {
  const router = useRouter();

  const handleOpenChange = () => {
    router.back();
  };

  return (
    <Dialog
      modal={true}
      defaultOpen={true}
      open={true}
      onOpenChange={handleOpenChange}
    >
      {/* <DialogOverlay> */}
      <DialogContent className="w-[100dvw] p-6 md:max-w-[700px] lg:max-w-[1000px] xl:max-w-[1200px]">
        {children}
      </DialogContent>
      {/* </DialogOverlay> */}
    </Dialog>
  );
}
