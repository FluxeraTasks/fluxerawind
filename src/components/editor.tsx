"use client";

import { PartialBlock } from "@blocknote/core";
import { BlockNoteView, Theme } from "@blocknote/mantine";
import { useCreateBlockNote } from "@blocknote/react";
import "@blocknote/mantine/style.css";

interface EditorProps {
  onChange?: (content: string) => void;
  initialContent?: string;
  editable?: boolean;
}
export const Editor = ({ onChange, initialContent, editable }: EditorProps) => {
  const editor = useCreateBlockNote({
    initialContent: initialContent
      ? (JSON.parse(initialContent) as PartialBlock[])
      : undefined,
  });

  return (
    <BlockNoteView
      editor={editor}
      editable={editable}
      theme={(localStorage.getItem("theme")?.toString() as Theme) ?? "light"}
      onChange={() =>
        onChange ? onChange(JSON.stringify(editor.document) ?? "") : {}
      }
    />
  );
};
