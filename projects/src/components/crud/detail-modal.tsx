"use client";

import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { FileText, Download, ImageIcon } from "lucide-react";
import type { UploadedFile } from "./file-upload";

export interface DetailField {
  name: string;
  label: string;
  type?: "text" | "number" | "badge" | "file" | "image" | "textarea";
  colSpan?: 1 | 2;
}

interface DetailModalProps {
  open: boolean;
  onClose: () => void;
  title: string;
  fields: DetailField[];
  data: Record<string, unknown> | null;
  size?: "default" | "large";
}

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return bytes + " B";
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
  return (bytes / (1024 * 1024)).toFixed(1) + " MB";
}

const EMPTY_PLACEHOLDER = (
  <span className="text-muted-foreground border-b border-dashed border-muted-foreground/40 px-1 text-sm">
    —
  </span>
);

export function DetailModal({
  open,
  onClose,
  title,
  fields,
  data,
  size = "default",
}: DetailModalProps) {
  if (!data) return null;

  const getBadgeVariant = (value: string): string => {
    const statusMap: Record<string, string> = {
      正常: "bg-green-100 text-green-700 border-green-200",
      临期: "bg-yellow-100 text-yellow-700 border-yellow-200",
      过期: "bg-red-100 text-red-700 border-red-200",
      整改中: "bg-orange-100 text-orange-700 border-orange-200",
      已停产: "bg-gray-100 text-gray-700 border-gray-200",
      已停业: "bg-gray-100 text-gray-700 border-gray-200",
      有效: "bg-green-100 text-green-700 border-green-200",
      即将到期: "bg-yellow-100 text-yellow-700 border-yellow-200",
      已过期: "bg-red-100 text-red-700 border-red-200",
    };
    return statusMap[value] || "bg-slate-100 text-slate-700 border-slate-200";
  };

  const isEmpty = (val: unknown): boolean => {
    if (val === null || val === undefined) return true;
    if (typeof val === "string" && val.trim() === "") return true;
    if (Array.isArray(val) && val.length === 0) return true;
    return false;
  };

  const renderValue = (field: DetailField) => {
    const val = data[field.name];

    if (isEmpty(val)) return EMPTY_PLACEHOLDER;

    switch (field.type) {
      case "badge": {
        return (
          <Badge
            variant="outline"
            className={`${getBadgeVariant(String(val))} border`}
          >
            {String(val)}
          </Badge>
        );
      }

      case "number": {
        return <span className="text-sm font-medium tabular-nums">{String(val)}</span>;
      }

      case "textarea": {
        return (
          <div className="text-sm whitespace-pre-wrap leading-relaxed text-slate-700">
            {String(val)}
          </div>
        );
      }

      case "image": {
        const files = val as UploadedFile[];
        return (
          <div className="flex flex-wrap gap-2">
            {files.map((f, i) => (
              <div
                key={i}
                className="group relative w-16 h-16 rounded-md border bg-muted overflow-hidden"
              >
                {f.type?.startsWith("image/") && f.url ? (
                  <img
                    src={f.url}
                    alt={f.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-primary/10">
                    <ImageIcon className="h-6 w-6 text-primary/60" />
                  </div>
                )}
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <span className="text-[10px] text-white truncate px-1">
                    {f.name}
                  </span>
                </div>
              </div>
            ))}
          </div>
        );
      }

      case "file": {
        const files = val as UploadedFile[];
        return (
          <div className="space-y-1.5">
            {files.map((f, i) => (
              <div
                key={i}
                className="flex items-center gap-2 text-sm p-1.5 rounded bg-muted/50"
              >
                <FileText className="h-3.5 w-3.5 text-primary shrink-0" />
                <span className="truncate flex-1">{f.name}</span>
                {f.size > 0 && (
                  <span className="text-xs text-muted-foreground shrink-0">
                    {formatFileSize(f.size)}
                  </span>
                )}
                <Download className="h-3 w-3 text-muted-foreground shrink-0" />
              </div>
            ))}
          </div>
        );
      }

      case "text":
      default: {
        return <span className="text-sm">{String(val)}</span>;
      }
    }
  };

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent
        className={`${
          size === "large" ? "sm:max-w-3xl" : "sm:max-w-2xl"
        } max-h-[85vh] flex flex-col !p-0 !gap-0 overflow-hidden`}
        showCloseButton
      >
        <DialogHeader className="px-6 pt-5 pb-3 shrink-0 border-b bg-card">
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription className="sr-only">查看详细信息</DialogDescription>
        </DialogHeader>

        <div className="flex-1 min-h-0 overflow-y-auto">
          <div className="px-6 py-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-5">
              {fields.map((field) => (
                <div
                  key={field.name}
                  className={field.colSpan === 2 ? "sm:col-span-2" : ""}
                >
                  <div className="text-xs text-muted-foreground mb-1.5 font-medium tracking-wide uppercase">
                    {field.label}
                  </div>
                  <div className="min-h-[1.5rem]">{renderValue(field)}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <DialogFooter className="px-6 py-3 border-t shrink-0 bg-muted/30">
          <Button variant="outline" onClick={onClose}>
            关闭
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
