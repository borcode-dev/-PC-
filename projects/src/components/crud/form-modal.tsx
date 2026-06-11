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
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { FileUpload, type UploadedFile } from "./file-upload";

export interface FormField {
  name: string;
  label: string;
  type: "text" | "number" | "select" | "date" | "file" | "image" | "badge" | "textarea";
  required?: boolean;
  placeholder?: string;
  options?: { label: string; value: string }[];
  colSpan?: number;
  accept?: string;
  maxFiles?: number;
}

interface FormModalProps {
  open: boolean;
  onClose: () => void;
  title: string;
  fields: FormField[];
  values: Record<string, unknown>;
  onChange: (name: string, value: unknown) => void;
  onSubmit: () => void;
  submitLabel?: string;
  cancelLabel?: string;
  isSubmitting?: boolean;
}

export function FormModal({
  open,
  onClose,
  title,
  fields,
  values,
  onChange,
  onSubmit,
  submitLabel = "确定",
  cancelLabel = "取消",
  isSubmitting = false,
}: FormModalProps) {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onSubmit();
  };

  const renderField = (field: FormField) => {
    const val = values[field.name];

    switch (field.type) {
      case "select":
        return (
          <Select
            value={String(val ?? "")}
            onValueChange={(v) => onChange(field.name, v)}
            disabled={isSubmitting}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder={field.placeholder || "请选择"} />
            </SelectTrigger>
            <SelectContent>
              {field.options?.map((opt) => (
                <SelectItem key={opt.value} value={opt.value}>
                  {opt.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        );
      case "date":
        return (
          <Input
            type="date"
            value={String(val ?? "")}
            onChange={(e) => onChange(field.name, e.target.value)}
            placeholder={field.placeholder}
            disabled={isSubmitting}
          />
        );
      case "textarea":
        return (
          <Textarea
            value={String(val ?? "")}
            onChange={(e) => onChange(field.name, e.target.value)}
            placeholder={field.placeholder}
            rows={4}
            disabled={isSubmitting}
            className="resize-y"
          />
        );
      case "file":
        return (
          <FileUpload
            accept={field.accept || "*"}
            maxFiles={field.maxFiles || 5}
            value={(val as UploadedFile[]) || []}
            onChange={(files) => onChange(field.name, files)}
            disabled={isSubmitting}
          />
        );
      case "image":
        return (
          <FileUpload
            accept={field.accept || (field.type === "image" ? "image/*" : undefined)}
            maxFiles={field.maxFiles || 3}
            value={(val as UploadedFile[]) || []}
            onChange={(files) => onChange(field.name, files)}
            disabled={isSubmitting}
          />
        );
      case "number":
        return (
          <Input
            type="number"
            value={String(val ?? "")}
            onChange={(e) => onChange(field.name, e.target.value)}
            placeholder={field.placeholder}
            disabled={isSubmitting}
          />
        );
      case "badge":
        return (
          <div className="flex flex-wrap gap-2 pt-1">
            {val && val !== "" ? (
              <Badge variant="secondary" className="text-sm">
                {String(val)}
              </Badge>
            ) : (
              <span className="text-sm text-muted-foreground">暂无</span>
            )}
          </div>
        );
      case "text":
      default:
        return (
          <Input
            value={String(val ?? "")}
            onChange={(e) => onChange(field.name, e.target.value)}
            placeholder={field.placeholder}
            disabled={isSubmitting}
          />
        );
    }
  };

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent
        className="sm:max-w-2xl max-h-[85vh] flex flex-col !p-0 !gap-0 overflow-hidden z-[100]"
        showCloseButton
      >
        <DialogHeader className="px-6 pt-5 pb-4 shrink-0 border-b">
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription className="sr-only">填写表单信息</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="flex flex-col flex-1 min-h-0 overflow-hidden">
          <div className="flex-1 min-h-0 overflow-y-auto px-6 py-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-4 pb-2">
              {fields.map((field) => (
                <div
                  key={field.name}
                  className={field.colSpan === 2 ? "sm:col-span-2" : ""}
                >
                  <Label className="mb-1.5 block text-sm font-medium">
                    {field.label}
                    {field.required && (
                      <span className="text-destructive ml-0.5">*</span>
                    )}
                  </Label>
                  {renderField(field)}
                </div>
              ))}
            </div>
          </div>

          <DialogFooter className="px-6 py-3 border-t shrink-0 bg-muted/30">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isSubmitting}
            >
              {cancelLabel}
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <svg
                    className="mr-2 h-4 w-4 animate-spin"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  提交中...
                </>
              ) : (
                submitLabel
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
