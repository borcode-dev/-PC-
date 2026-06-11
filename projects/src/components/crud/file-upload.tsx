"use client";

import React, { useCallback, useRef, useState } from "react";
import { Upload, FileText, Image as ImageIcon, X } from "lucide-react";
import { Button } from "@/components/ui/button";

export interface UploadedFile {
  id: string;
  name: string;
  size: number;
  type: string;
  url?: string;
}

interface FileUploadProps {
  value?: UploadedFile[];
  onChange?: (files: UploadedFile[]) => void;
  accept?: string;
  maxFiles?: number;
  maxSizeMB?: number;
  disabled?: boolean;
}

export function FileUpload({
  value = [],
  onChange,
  accept = "image/*,.pdf,.doc,.docx",
  maxFiles = 5,
  maxSizeMB = 10,
  disabled = false,
}: FileUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragActive, setDragActive] = useState(false);
  const [errors, setErrors] = useState<string[]>([]);

  const handleFiles = useCallback(
    (fileList: FileList | null) => {
      if (!fileList || !onChange) return;
      const newErrors: string[] = [];
      const newFiles: UploadedFile[] = [];
      const remaining = maxFiles - value.length;

      if (fileList.length > remaining) {
        newErrors.push(`最多上传 ${maxFiles} 个文件，还可上传 ${remaining} 个`);
      }

      const filesToProcess = Array.from(fileList).slice(0, remaining);
      for (const file of filesToProcess) {
        if (file.size > maxSizeMB * 1024 * 1024) {
          newErrors.push(`${file.name} 超过 ${maxSizeMB}MB 限制`);
          continue;
        }
        const id = `file-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
        const url = URL.createObjectURL(file);
        newFiles.push({
          id,
          name: file.name,
          size: file.size,
          type: file.type || "application/octet-stream",
          url,
        });
      }

      setErrors(newErrors);
      if (newFiles.length > 0) {
        onChange([...value, ...newFiles]);
      }
    },
    [value, onChange, maxFiles, maxSizeMB]
  );

  const handleRemove = useCallback(
    (id: string) => {
      if (!onChange) return;
      const file = value.find((f) => f.id === id);
      if (file?.url) URL.revokeObjectURL(file.url);
      onChange(value.filter((f) => f.id !== id));
      if (inputRef.current) inputRef.current.value = "";
    },
    [value, onChange]
  );

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") setDragActive(true);
    else if (e.type === "dragleave") setDragActive(false);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setDragActive(false);
      handleFiles(e.dataTransfer.files);
    },
    [handleFiles]
  );

  const formatSize = (bytes: number) => {
    if (bytes < 1024) return bytes + " B";
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
    return (bytes / (1024 * 1024)).toFixed(1) + " MB";
  };

  const isImage = (type: string) => type.startsWith("image/");

  return (
    <div className="space-y-3">
      <div
        role="button"
        tabIndex={0}
        className={`relative rounded-xl border-2 border-dashed p-6 text-center transition-colors ${
          dragActive
            ? "border-primary bg-primary/5"
            : "border-muted-foreground/25 hover:border-primary/50"
        } ${disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
        onClick={() => !disabled && inputRef.current?.click()}
        onKeyDown={(e) => {
          if (!disabled && (e.key === "Enter" || e.key === " ")) {
            inputRef.current?.click();
          }
        }}
        onDragEnter={handleDrag}
        onDragOver={handleDrag}
        onDragLeave={handleDrag}
        onDrop={handleDrop}
      >
        <input
          ref={inputRef}
          type="file"
          multiple
          accept={accept}
          className="hidden"
          disabled={disabled}
          onChange={(e) => handleFiles(e.target.files)}
        />
        <div className="flex flex-col items-center gap-2">
          <div className="rounded-full bg-muted p-3">
            <Upload className="h-5 w-5 text-muted-foreground" />
          </div>
          <p className="text-sm text-muted-foreground">
            拖拽文件到此处，或 <span className="text-primary font-medium">点击上传</span>
          </p>
          <p className="text-xs text-muted-foreground/70">
            支持 {accept.replace(/\*/g, "所有").replace(/,/g, "、")} 格式，单个文件不超过 {maxSizeMB}MB
          </p>
        </div>
      </div>

      {errors.length > 0 && (
        <div className="space-y-1">
          {errors.map((err, i) => (
            <p key={i} className="text-sm text-red-600 font-medium">{err}</p>
          ))}
        </div>
      )}

      {value.length > 0 && (
        <ul className="space-y-2">
          {value.map((file) => (
            <li
              key={file.id}
              className="flex items-center gap-3 rounded-lg border bg-card p-3 shadow-sm transition-colors hover:bg-muted/50"
            >
              {isImage(file.type) ? (
                <ImageIcon className="h-5 w-5 text-blue-500 shrink-0" />
              ) : (
                <FileText className="h-5 w-5 text-orange-500 shrink-0" />
              )}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{file.name}</p>
                <p className="text-xs text-muted-foreground">{formatSize(file.size)}</p>
              </div>
              {!disabled && (
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7 shrink-0"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleRemove(file.id);
                  }}
                >
                  <X className="h-4 w-4" />
                </Button>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
