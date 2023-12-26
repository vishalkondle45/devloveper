import { Box, InputLabel } from "@mantine/core";
import { Link, RichTextEditor } from "@mantine/tiptap";
import Highlight from "@tiptap/extension-highlight";
import Image from "@tiptap/extension-image";
import Placeholder from "@tiptap/extension-placeholder";
import SubScript from "@tiptap/extension-subscript";
import Superscript from "@tiptap/extension-superscript";
import TextAlign from "@tiptap/extension-text-align";
import Underline from "@tiptap/extension-underline";
import { useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { useState } from "react";

export default function TextEditor({
  text,
  handleText,
  name,
  label,
  placeholder,
  withImage = true,
  withParagraph = true,
}: any) {
  const [isFocused, setIsFocused] = useState(false);

  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      Superscript,
      SubScript,
      Highlight,
      withImage && Image,
      TextAlign.configure({ types: ["heading", "paragraph"] }),
      Link.configure({
        HTMLAttributes: {
          rel: "noopener noreferrer",
          target: "_blank",
          linkOnPaste: true,
          autolink: true,
          openOnClick: true,
        },
      }),
      Placeholder.configure({ placeholder }),
    ],
    editorProps: {
      handleKeyDown(view, { code }) {
        return (code === "Enter" || code === "NumpadEnter") && !withParagraph;
      },
    },
    content: text,
    onUpdate({ editor }) {
      handleText(name, editor.getText() ? editor.getHTML() : "");
    },
  });

  if (!editor) {
    return null;
  }

  return (
    <Box>
      <InputLabel>{label}</InputLabel>
      <RichTextEditor style={{ borderRadius: 0 }} editor={editor}>
        {isFocused && (
          <RichTextEditor.Toolbar sticky stickyOffset={60}>
            <RichTextEditor.ControlsGroup>
              <RichTextEditor.Bold />
              <RichTextEditor.Italic />
              <RichTextEditor.Underline />
              <RichTextEditor.Strikethrough />
              <RichTextEditor.ClearFormatting />
              <RichTextEditor.Highlight />
              <RichTextEditor.Code />
            </RichTextEditor.ControlsGroup>

            <RichTextEditor.ControlsGroup>
              <RichTextEditor.H1 />
              <RichTextEditor.H2 />
              <RichTextEditor.H3 />
              <RichTextEditor.H4 />
            </RichTextEditor.ControlsGroup>

            <RichTextEditor.ControlsGroup>
              <RichTextEditor.Hr />
              <RichTextEditor.BulletList />
              <RichTextEditor.OrderedList />
              <RichTextEditor.Subscript />
              <RichTextEditor.Superscript />
            </RichTextEditor.ControlsGroup>

            <RichTextEditor.ControlsGroup>
              <RichTextEditor.AlignLeft />
              <RichTextEditor.AlignCenter />
              <RichTextEditor.AlignJustify />
              <RichTextEditor.AlignRight />
            </RichTextEditor.ControlsGroup>
          </RichTextEditor.Toolbar>
        )}
        <RichTextEditor.Content
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
        />
      </RichTextEditor>
    </Box>
  );
}
