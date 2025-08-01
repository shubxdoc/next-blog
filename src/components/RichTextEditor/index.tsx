"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";
import Menubar from "./menubar";
import TextAlign from "@tiptap/extension-text-align";
import Highlight from "@tiptap/extension-highlight";
import { useEditorStore } from "@/store/use-editor-store";
import { cn } from "@/lib/utils";
import "tiptap-extension-resizable-image/styles.css";
import { ResizableImage } from "tiptap-extension-resizable-image";

const RichTextEditor = ({
  value,
  onChange,
  readOnly = false,
}: {
  value?: string;
  onChange?: (value: string) => void;
  readOnly?: boolean;
}) => {
  const { setEditor } = useEditorStore();

  const editor = useEditor({
    content: value,
    editable: !readOnly,
    immediatelyRender: false,
    onCreate({ editor }) {
      setEditor(editor);
    },
    onUpdate({ editor }) {
      const text = editor.getText();
      if (onChange) {
        onChange?.(text);
      }
      setEditor(editor);
    },
    onDestroy() {
      setEditor(null);
    },
    onSelectionUpdate({ editor }) {
      setEditor(editor);
    },
    onTransaction({ editor }) {
      setEditor(editor);
    },
    onFocus({ editor }) {
      setEditor(editor);
    },
    onBlur({ editor }) {
      setEditor(editor);
    },
    onContentError({ editor }) {
      setEditor(editor);
    },
    extensions: [
      StarterKit.configure({
        bulletList: {
          HTMLAttributes: {
            class: "list-disc ml-3",
          },
        },
        orderedList: {
          HTMLAttributes: {
            class: "list-decimal ml-3",
          },
        },
      }),
      Image,
      ResizableImage.configure({
        defaultWidth: 200,
        defaultHeight: 200,
      }),
      TextAlign.configure({
        types: ["heading", "paragraph"],
      }),
      Highlight,
    ],
    editorProps: {
      attributes: {
        class: cn("prose w-full bg-transparent my-10", {
          "min-h-[250px] max-h-[450px] my-2 file:text-foreground bg-input/20 border-input overflow-y-auto w-full rounded-md border p-3 text-base shadow-xs transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50  focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 aria-invalid:ring-destructive/40 aria-invalid:border-destructive":
            !readOnly,
        }),
      },
    },
  });

  return (
    <>
      {!readOnly && <Menubar />}
      <EditorContent editor={editor} />
    </>
  );
};

export default RichTextEditor;
