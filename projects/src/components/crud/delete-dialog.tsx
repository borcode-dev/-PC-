"use client";

import React from "react";
import { AlertTriangle, Loader2 } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface DeleteDialogProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => Promise<void> | void;
  itemName?: string;
  description?: string;
  isDeleting?: boolean;
}

export function DeleteDialog({
  open,
  onClose,
  onConfirm,
  itemName,
  description,
  isDeleting = false,
}: DeleteDialogProps) {
  const [internalDeleting, setInternalDeleting] = React.useState(false);
  const deleting = isDeleting || internalDeleting;

  const handleConfirm = async () => {
    if (deleting) return;
    setInternalDeleting(true);
    try {
      await onConfirm();
    } finally {
      setInternalDeleting(false);
      onClose();
    }
  };

  const displayDescription =
    description ||
    (itemName
      ? `此操作不可撤销。您确定要删除「${itemName}」吗？`
      : "此操作不可撤销。您确定要删除吗？");

  return (
    <AlertDialog open={open} onOpenChange={(v) => !v && !deleting && onClose()}>
      <AlertDialogContent className="sm:max-w-md">
        <AlertDialogHeader>
          <div className="flex items-center gap-3">
            <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-destructive/10 text-destructive">
              <AlertTriangle className="size-5" />
            </div>
            <AlertDialogTitle className="text-destructive">
              确认删除
            </AlertDialogTitle>
          </div>
          <AlertDialogDescription className="pt-2">
            {displayDescription}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={onClose} disabled={deleting}>
            取消
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={handleConfirm}
            disabled={deleting}
            className="bg-destructive text-white hover:bg-destructive/90 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40"
          >
            {deleting && <Loader2 className="size-4 animate-spin" />}
            {deleting ? "删除中..." : "确定删除"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
