"use client";

import {
  AlignCenter,
  AlignJustify,
  AlignLeft,
  AlignRight,
  Bold,
  ChevronDownIcon,
  Highlighter,
  ImageIcon,
  Italic,
  Link2Icon,
  List,
  ListOrdered,
  LoaderIcon,
  Strikethrough,
} from "lucide-react";
import { Toggle } from "../ui/toggle";
import { useEditorStore } from "@/store/use-editor-store";
import { type Level } from "@tiptap/extension-heading";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { cn, UploadImage } from "@/lib/utils";
import { Separator } from "../ui/separator";
import { useState } from "react";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { toast } from "sonner";

export const ImageBtn = () => {
  const { editor } = useEditorStore();

  const onChange = (src: string) => {
    editor?.chain().focus().setImage({ src }).run();
  };

  const [isUploading, setIsUploading] = useState(false);

  const MAX_FILE_SIZE_MB = 3;

  const onUpload = async () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";

    input.onchange = async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file) return;

      const fileSizeMB = file.size / (1024 * 1024);
      if (fileSizeMB > MAX_FILE_SIZE_MB) {
        toast.warning("File is too large", {
          description: ` Maximum allowed size is ${MAX_FILE_SIZE_MB} MB.`,
        });
        return;
      }

      setIsUploading(true);
      try {
        const imageUrl = await UploadImage(file);
        if (imageUrl) onChange(imageUrl);
      } catch (err) {
        console.error("Upload failed:", err);
      } finally {
        setIsUploading(false);
      }
    };

    input.click();
  };

  return (
    <>
      <Toggle
        pressed={false}
        disabled={isUploading}
        className="..."
        onClick={onUpload}
      >
        {isUploading ? (
          <LoaderIcon className="animate-spin" />
        ) : (
          <ImageIcon className="size-4" />
        )}
      </Toggle>
    </>
  );
};

export const LinkBtn = () => {
  const { editor } = useEditorStore();

  const [value, setValue] = useState("");

  const onChange = (href: string) => {
    editor?.chain().focus().extendMarkRange("link").setLink({ href }).run();
    setValue("");
  };

  return (
    <>
      <DropdownMenu
        onOpenChange={(open) => {
          if (open) {
            setValue(editor?.getAttributes("link").href || "");
          }
        }}
      >
        <DropdownMenuTrigger asChild>
          <Toggle className="shrink-0 flex flex-col items-center justify-center rounded-sm px-1.5 overflow-hidden text-sm">
            <Link2Icon className="size-4" />
          </Toggle>
        </DropdownMenuTrigger>

        <DropdownMenuContent className="p-2.5 flex items-center gap-x-2">
          <Input
            placeholder="https://example.com"
            value={value}
            onChange={(e) => setValue(e.target.value)}
          />
          <Button onClick={() => onChange(value)}>Apply</Button>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
};

export const HeadingLevelButton = () => {
  const { editor } = useEditorStore();

  const headings = [
    { label: "Normal text", value: 0, fontSize: "16px" },
    { label: "Heading 1", value: 1, fontSize: "32px" },
    { label: "Heading 2", value: 2, fontSize: "24px" },
    { label: "Heading 3", value: 3, fontSize: "20px" },
    { label: "Heading 4", value: 4, fontSize: "18px" },
    { label: "Heading 5", value: 5, fontSize: "16px" },
  ];

  const getCurrentHeading = () => {
    for (let level = 1; level <= 5; level++) {
      if (editor?.isActive("heading", { level })) {
        return `Heading ${level}`;
      }
    }

    return "Normal text";
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Toggle className="shrink-0 flex items-center justify-center rounded-sm px-1.5 overflow-hidden text-sm">
          <span className="truncate">{getCurrentHeading()}</span>
          <ChevronDownIcon className="ml-2 size-4 shrink-0" />
        </Toggle>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="p-1 flex flex-col gap-y-1">
        {headings.map(({ label, value, fontSize }) => (
          <Toggle
            key={value}
            className={cn("flex items-center gap-x-2 px-2 py-1 rounded-sm")}
            pressed={
              (value === 0 && !editor?.isActive("heading")) ||
              editor?.isActive("heading", { level: value })
            }
            style={{ fontSize }}
            onClick={() => {
              if (value === 0) {
                editor?.chain().focus().setParagraph().run();
              } else {
                editor
                  ?.chain()
                  .focus()
                  .toggleHeading({ level: value as Level })
                  .run();
              }
            }}
          >
            {label}
          </Toggle>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default function Menubar() {
  const { editor } = useEditorStore();

  if (!editor) {
    return null;
  }

  const Options = [
    {
      icon: <Bold className="size-4" />,
      onClick: () => editor.chain().focus().toggleBold().run(),
      pressed: editor?.isActive("bold"),
    },
    {
      icon: <Italic className="size-4" />,
      onClick: () => editor.chain().focus().toggleItalic().run(),
      pressed: editor.isActive("italic"),
    },
    {
      icon: <Strikethrough className="size-4" />,
      onClick: () => editor.chain().focus().toggleStrike().run(),
      pressed: editor.isActive("strike"),
    },
    {
      icon: <AlignLeft className="size-4" />,
      onClick: () => editor.chain().focus().setTextAlign("left").run(),
      pressed: editor.isActive({ textAlign: "left" }),
    },
    {
      icon: <AlignCenter className="size-4" />,
      onClick: () => editor.chain().focus().setTextAlign("center").run(),
      pressed: editor.isActive({ textAlign: "center" }),
    },
    {
      icon: <AlignRight className="size-4" />,
      onClick: () => editor.chain().focus().setTextAlign("right").run(),
      pressed: editor.isActive({ textAlign: "right" }),
    },
    {
      icon: <AlignJustify className="size-4" />,
      onClick: () => editor.chain().focus().setTextAlign("justify").run(),
      pressed: editor.isActive({ textAlign: "justify" }),
    },
    {
      icon: <List className="size-4" />,
      onClick: () => editor.chain().focus().toggleBulletList().run(),
      pressed: editor.isActive("bulletList"),
    },
    {
      icon: <ListOrdered className="size-4" />,
      onClick: () => editor.chain().focus().toggleOrderedList().run(),
      pressed: editor.isActive("orderedList"),
    },
    {
      icon: <Highlighter className="size-4" />,
      onClick: () => editor.chain().focus().toggleHighlight().run(),
      pressed: editor.isActive("highlight"),
    },
  ];

  return (
    <div className="flex items-center border px-2.5 py-0.5 rounded-md min-h-[40px] gap-x-2 overflow-x-auto">
      <HeadingLevelButton />
      <Separator orientation="vertical" />
      {Options.map((option, index) => (
        <Toggle
          key={index}
          pressed={option.pressed}
          onPressedChange={option.onClick}
        >
          {option.icon}
        </Toggle>
      ))}
      <Separator orientation="vertical" />
      <LinkBtn />
      <Separator orientation="vertical" />
      <ImageBtn />
    </div>
  );
}
