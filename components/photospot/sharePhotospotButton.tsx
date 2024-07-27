import { FaShareAlt } from "react-icons/fa";
import { Dialog, DialogContent, DialogTrigger } from "../ui/dialog";
import { buttonVariants } from "../ui/button";
import { cn } from "@/lib/utils";
import SharePhotospotDialog from "./sharePhotospotDialog";

export default function SharePhotospotButton({ id }: { id: number }) {
  return (
    <Dialog>
      <DialogTrigger>
        <div className={cn(buttonVariants({ variant: "default" }))}>
          <FaShareAlt className="w-6 h-6" />
        </div>
      </DialogTrigger>
      <DialogContent>
        <SharePhotospotDialog id={id} />
      </DialogContent>
    </Dialog>
  );
}
