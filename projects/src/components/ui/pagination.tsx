"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface PaginationProps {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  pageSize?: number;
  totalItems?: number;
  className?: string;
}

export function Pagination({
  page,
  totalPages,
  onPageChange,
  pageSize,
  totalItems,
  className,
}: PaginationProps) {
  const canPrev = page > 1;
  const canNext = page < totalPages;

  return (
    <div
      className={cn(
        "flex items-center justify-between text-sm text-muted-foreground",
        className
      )}
    >
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          disabled={!canPrev}
          onClick={() => canPrev && onPageChange(page - 1)}
        >
          <ChevronLeft className="size-4" />
          上一页
        </Button>
        <span className="min-w-[80px] text-center">
          第 <span className="font-medium text-foreground">{page}</span> / {totalPages} 页
        </span>
        <Button
          variant="outline"
          size="sm"
          disabled={!canNext}
          onClick={() => canNext && onPageChange(page + 1)}
        >
          下一页
          <ChevronRight className="size-4" />
        </Button>
      </div>
      <div>
        {totalItems !== undefined && pageSize !== undefined && (
          <span>
            共 {totalItems} 条，每页 {pageSize} 条
          </span>
        )}
      </div>
    </div>
  );
}
