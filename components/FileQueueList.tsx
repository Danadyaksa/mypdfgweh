"use client";

import React, { useRef } from "react";
import { FileText, Trash2, ArrowUp, ArrowDown, Plus } from "lucide-react";
import { formatBytes } from "@/lib/utils";

interface FileQueueListProps {
  files: File[];
  onRemove: (index: number) => void;
  onMoveUp?: (index: number) => void;
  onMoveDown?: (index: number) => void;
  onAddMore?: (newFiles: File[]) => void;
  accept?: string;
  allowReorder?: boolean;
}

export function FileQueueList({
  files,
  onRemove,
  onMoveUp,
  onMoveDown,
  onAddMore,
  accept = "application/pdf",
  allowReorder = true,
}: FileQueueListProps) {
  const addMoreInputRef = useRef<HTMLInputElement>(null);

  const handleAddMoreChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && onAddMore) {
      onAddMore(Array.from(e.target.files));
      if (addMoreInputRef.current) addMoreInputRef.current.value = "";
    }
  };

  return (
    <div className="flex flex-col gap-3 w-full">
      <div className="flex items-center justify-between">
        <span className="text-xs font-bold uppercase tracking-wider text-stone-500">
          File Terpilih ({files.length})
        </span>

        {onAddMore && (
          <>
            <input
              ref={addMoreInputRef}
              type="file"
              accept={accept}
              multiple
              className="hidden"
              onChange={handleAddMoreChange}
            />
            <button
              type="button"
              onClick={() => addMoreInputRef.current?.click()}
              className="inline-flex items-center gap-1 text-xs font-semibold text-rose-600 hover:text-rose-700 bg-rose-50 hover:bg-rose-100/80 px-2.5 py-1 rounded-lg transition-colors"
            >
              <Plus className="h-3.5 w-3.5" />
              <span>Tambah File</span>
            </button>
          </>
        )}
      </div>

      <div className="grid gap-2 max-h-96 overflow-y-auto pr-1">
        {files.map((file, idx) => (
          <div
            key={`${file.name}-${idx}`}
            className="flex items-center justify-between rounded-xl border border-stone-200/90 bg-white p-3 shadow-xs hover:border-stone-300 transition-colors"
          >
            <div className="flex items-center gap-3 min-w-0 pr-2">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-rose-50 text-rose-600">
                <FileText className="h-4 w-4" />
              </div>
              <div className="flex flex-col min-w-0">
                <span className="text-sm font-medium text-stone-800 truncate" title={file.name}>
                  {file.name}
                </span>
                <span className="text-xs text-stone-400">
                  {formatBytes(file.size)}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-0.5 sm:gap-1 shrink-0">
              {allowReorder && onMoveUp && onMoveDown && (
                <>
                  <button
                    type="button"
                    disabled={idx === 0}
                    onClick={() => onMoveUp(idx)}
                    className="min-h-[36px] min-w-[36px] flex items-center justify-center rounded-lg text-stone-400 hover:text-stone-700 hover:bg-stone-100 disabled:opacity-20 disabled:hover:bg-transparent transition-colors"
                    title="Pindahkan ke atas"
                    aria-label="Pindahkan ke atas"
                  >
                    <ArrowUp className="h-4 w-4" />
                  </button>
                  <button
                    type="button"
                    disabled={idx === files.length - 1}
                    onClick={() => onMoveDown(idx)}
                    className="min-h-[36px] min-w-[36px] flex items-center justify-center rounded-lg text-stone-400 hover:text-stone-700 hover:bg-stone-100 disabled:opacity-20 disabled:hover:bg-transparent transition-colors"
                    title="Pindahkan ke bawah"
                    aria-label="Pindahkan ke bawah"
                  >
                    <ArrowDown className="h-4 w-4" />
                  </button>
                </>
              )}

              <button
                type="button"
                onClick={() => onRemove(idx)}
                className="min-h-[36px] min-w-[36px] flex items-center justify-center rounded-lg text-stone-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                title="Hapus file"
                aria-label="Hapus file"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
