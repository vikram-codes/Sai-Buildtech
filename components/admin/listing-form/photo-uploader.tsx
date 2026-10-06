"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { AlertCircle, ArrowLeft, ArrowRight, ImagePlus, Loader2, RotateCcw, Star, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ACCEPTED_TYPES, compressImage } from "@/lib/images/compress";
import { createClient } from "@/lib/supabase/client";
import { cn } from "@/lib/utils";

const BUCKET = "property-images";
const MAX_PHOTOS = 30;

type Item = {
  key: string;
  status: "uploading" | "done" | "error";
  url?: string; // public URL once uploaded (or an existing photo)
  preview?: string; // local preview while uploading
  path?: string; // storage path — only for photos uploaded in this session
  file?: File; // kept for "Retry"
  error?: string;
};

type Props = {
  /** Current photo URLs, in order (first = cover). */
  value: string[];
  onChange: (urls: string[]) => void;
  /** Storage folder for this listing: listings/<id>/… */
  getListingId: () => string;
  /** Told how many photos are still uploading (so the form can wait before saving). */
  onUploadingChange?: (count: number) => void;
  invalid?: boolean;
};

const newKey = () => crypto.randomUUID();

function friendlyUploadError(message: string) {
  if (/row-level security|unauthorized|403/i.test(message)) return "Not allowed — please sign in again.";
  if (/too large|413|exceeded/i.test(message)) return "Photo is too large even after shrinking.";
  if (/mime|type/i.test(message)) return "Unsupported photo format.";
  return "Upload failed. Check your connection and retry.";
}

/**
 * Drag-and-drop photo manager. Photos are shrunk in the browser (≤2400px, WebP) and uploaded straight
 * to the property-images bucket under listings/<id>/. The form only stores the resulting URLs.
 * Photos uploaded and then removed before saving are deleted from storage right away.
 */
export function PhotoUploader({ value, onChange, getListingId, onUploadingChange, invalid }: Props) {
  const [items, setItems] = useState<Item[]>(() => value.map((url) => ({ key: url, status: "done", url })));
  const [dragOver, setDragOver] = useState(false);
  const dragIndex = useRef<number | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Report finished photos (in order) to the form whenever they change
  const urls = items.filter((i) => i.status === "done" && i.url).map((i) => i.url!);
  const urlsKey = urls.join("\n");
  const onChangeRef = useRef(onChange);
  useEffect(() => {
    onChangeRef.current = onChange;
  });
  useEffect(() => {
    onChangeRef.current(urlsKey ? urlsKey.split("\n") : []);
  }, [urlsKey]);

  // Free local preview memory when leaving the page
  const itemsRef = useRef(items);
  useEffect(() => {
    itemsRef.current = items;
  });
  useEffect(() => () => itemsRef.current.forEach((i) => i.preview && URL.revokeObjectURL(i.preview)), []);

  const update = (key: string, patch: Partial<Item>) =>
    setItems((list) => list.map((i) => (i.key === key ? { ...i, ...patch } : i)));

  const upload = async (key: string, file: File) => {
    update(key, { status: "uploading", error: undefined });
    try {
      const image = await compressImage(file);
      const path = `listings/${getListingId()}/${crypto.randomUUID()}.${image.extension}`;
      const storage = createClient().storage.from(BUCKET);
      const { error } = await storage.upload(path, image.blob, {
        contentType: image.type,
        cacheControl: "31536000", // a year — file names are unique, so they never change
        upsert: false,
      });
      if (error) throw new Error(friendlyUploadError(error.message));
      update(key, { status: "done", url: storage.getPublicUrl(path).data.publicUrl, path });
    } catch (e) {
      update(key, { status: "error", error: e instanceof Error ? e.message : "Upload failed." });
    }
  };

  const addFiles = (fileList: FileList | File[]) => {
    const room = MAX_PHOTOS - items.length;
    const files = Array.from(fileList).slice(0, Math.max(0, room));
    const added: Item[] = files.map((file) => ({
      key: newKey(),
      status: "uploading",
      file,
      preview: URL.createObjectURL(file),
    }));
    setItems((list) => [...list, ...added]);
    added.forEach((item) => void upload(item.key, item.file!));
  };

  const remove = (key: string) => {
    const item = items.find((i) => i.key === key);
    if (item?.preview) URL.revokeObjectURL(item.preview);
    // Uploaded in this session and never saved → delete from storage now (saved photos are removed on Save)
    if (item?.path) void createClient().storage.from(BUCKET).remove([item.path]);
    setItems((list) => list.filter((i) => i.key !== key));
  };

  const move = (from: number, to: number) =>
    setItems((list) => {
      if (to < 0 || to >= list.length || from === to) return list;
      const next = [...list];
      const [moved] = next.splice(from, 1);
      next.splice(to, 0, moved);
      return next;
    });

  const uploading = items.filter((i) => i.status === "uploading").length;
  const onUploadingRef = useRef(onUploadingChange);
  useEffect(() => {
    onUploadingRef.current = onUploadingChange;
  });
  useEffect(() => {
    onUploadingRef.current?.(uploading);
  }, [uploading]);

  return (
    <div className="space-y-4">
      {/* Drop zone */}
      <div
        onDragOver={(e) => {
          if (e.dataTransfer.types.includes("Files")) {
            e.preventDefault();
            setDragOver(true);
          }
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={(e) => {
          if (!e.dataTransfer.files.length) return;
          e.preventDefault();
          setDragOver(false);
          addFiles(e.dataTransfer.files);
        }}
        className={cn(
          "flex flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed px-6 py-10 text-center transition-colors",
          dragOver ? "border-gold bg-gold/5" : invalid ? "border-destructive/50" : "border-border",
        )}
      >
        <ImagePlus className="size-8 text-gold" />
        <p className="font-medium">Drag photos here</p>
        <p className="text-sm text-muted-foreground">
          JPG, PNG or WebP · shrunk automatically before upload · up to {MAX_PHOTOS} photos
        </p>
        <Button
          type="button"
          variant="outline"
          className="mt-2"
          onClick={() => inputRef.current?.click()}
          disabled={items.length >= MAX_PHOTOS}
        >
          Choose photos
        </Button>
        <input
          ref={inputRef}
          type="file"
          accept={ACCEPTED_TYPES.join(",")}
          multiple
          hidden
          onChange={(e) => {
            if (e.target.files) addFiles(e.target.files);
            e.target.value = ""; // allow picking the same file again
          }}
        />
      </div>

      {uploading > 0 && (
        <p role="status" className="flex items-center gap-2 text-sm text-muted-foreground">
          <Loader2 className="size-4 animate-spin" /> Uploading {uploading} {uploading === 1 ? "photo" : "photos"}…
        </p>
      )}

      {/* Photos */}
      {items.length > 0 && (
        <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {items.map((item, index) => (
            <li
              key={item.key}
              draggable={item.status === "done"}
              onDragStart={() => (dragIndex.current = index)}
              onDragOver={(e) => {
                if (dragIndex.current !== null) e.preventDefault();
              }}
              onDrop={(e) => {
                if (dragIndex.current === null) return;
                e.preventDefault();
                move(dragIndex.current, index);
                dragIndex.current = null;
              }}
              onDragEnd={() => (dragIndex.current = null)}
              className="group relative overflow-hidden rounded-lg border bg-muted"
            >
              <div className="relative aspect-[4/3]">
                {(item.url || item.preview) && (
                  <Image
                    src={item.url ?? item.preview!}
                    alt={`Photo ${index + 1}`}
                    fill
                    sizes="240px"
                    unoptimized={!item.url}
                    className={cn("object-cover", item.status !== "done" && "opacity-50")}
                  />
                )}
                {item.status === "uploading" && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Loader2 className="size-6 animate-spin text-white drop-shadow" />
                  </div>
                )}
                {item.status === "error" && (
                  <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-background/85 p-2 text-center">
                    <AlertCircle className="size-5 text-destructive" />
                    <p className="text-xs text-destructive">{item.error}</p>
                    {item.file && (
                      <Button type="button" size="xs" variant="outline" onClick={() => upload(item.key, item.file!)}>
                        <RotateCcw /> Retry
                      </Button>
                    )}
                  </div>
                )}
                {index === 0 && item.status === "done" && (
                  <span className="absolute top-2 left-2 rounded-full bg-primary px-2 py-0.5 text-xs font-semibold text-primary-foreground">
                    Cover
                  </span>
                )}
                <button
                  type="button"
                  onClick={() => remove(item.key)}
                  aria-label={`Remove photo ${index + 1}`}
                  className="absolute top-2 right-2 flex size-7 items-center justify-center rounded-full bg-background/90 text-foreground shadow hover:bg-background"
                >
                  <X className="size-4" />
                </button>
              </div>

              {item.status === "done" && (
                <div className="flex items-center justify-between gap-1 bg-card px-1.5 py-1">
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon-xs"
                    onClick={() => move(index, index - 1)}
                    disabled={index === 0}
                    aria-label={`Move photo ${index + 1} left`}
                  >
                    <ArrowLeft />
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    size="xs"
                    onClick={() => move(index, 0)}
                    disabled={index === 0}
                    className="text-xs"
                  >
                    <Star /> Set as cover
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon-xs"
                    onClick={() => move(index, index + 1)}
                    disabled={index === items.length - 1}
                    aria-label={`Move photo ${index + 1} right`}
                  >
                    <ArrowRight />
                  </Button>
                </div>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
