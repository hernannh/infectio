import React from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";

interface ModalProps {
  open: boolean;
  children: React.ReactNode;
  onClose: () => void;
}

const Modal = ({ open, children, onClose }: ModalProps) => (
  <Dialog open={open} onOpenChange={(next) => !next && onClose()}>
    <DialogContent>{children}</DialogContent>
  </Dialog>
);

export default Modal;
