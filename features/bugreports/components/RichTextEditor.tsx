'use client';

import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Link from '@tiptap/extension-link';
import { Bold, Italic, List, ListOrdered, Code, Quote, Link as LinkIcon } from 'lucide-react';
import { useEffect } from 'react';

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
}

export default function RichTextEditor({ value, onChange }: RichTextEditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: 'text-blue-600 hover:text-blue-800 underline',
        },
      }),
    ],
    content: value.length > 0 ? `${value}` : value,
    editorProps: {
      attributes: {
        class: 'prose prose-sm max-w-none min-h-[150px] focus:outline-none',
      },
    },
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    immediatelyRender: false,
  });

  useEffect(() => {
    editor?.commands.setContent(value);
  }, [editor]);

  if (!editor) return null;

  const toggleFormat = (format: string) => {
    switch (format) {
      case 'bold':
        editor.chain().focus().toggleBold().run();
        break;
      case 'italic':
        editor.chain().focus().toggleItalic().run();
        break;
      case 'bullet':
        editor.chain().focus().toggleBulletList().run();
        break;
      case 'ordered':
        editor.chain().focus().toggleOrderedList().run();
        break;
      case 'code':
        editor.chain().focus().toggleCode().run();
        break;
      case 'blockquote':
        editor.chain().focus().toggleBlockquote().run();
        break;
      case 'link':
        const url = window.prompt('Enter URL');
        if (url) {
          editor.chain().focus().setLink({ href: url }).run();
        }
        break;
    }
  };

  return (
    <div className="overflow-hidden rounded-lg border">
      <div className="flex items-center gap-1 border-b bg-gray-50 p-2">
        <button
          type="button"
          onClick={() => toggleFormat('bold')}
          className={`rounded p-1.5 hover:bg-gray-200 ${editor.isActive('bold') ? 'bg-gray-200' : ''}`}
          title="Bold"
        >
          <Bold size={16} />
        </button>
        <button
          type="button"
          onClick={() => toggleFormat('italic')}
          className={`rounded p-1.5 hover:bg-gray-200 ${editor.isActive('italic') ? 'bg-gray-200' : ''}`}
          title="Italic"
        >
          <Italic size={16} />
        </button>
        <div className="mx-1 h-6 w-px bg-gray-300" />
        <button
          type="button"
          onClick={() => toggleFormat('bullet')}
          className={`rounded p-1.5 hover:bg-gray-200 ${editor.isActive('bulletList') ? 'bg-gray-200' : ''}`}
          title="Bullet List"
        >
          <List size={16} />
        </button>
        <button
          type="button"
          onClick={() => toggleFormat('ordered')}
          className={`rounded p-1.5 hover:bg-gray-200 ${editor.isActive('orderedList') ? 'bg-gray-200' : ''}`}
          title="Numbered List"
        >
          <ListOrdered size={16} />
        </button>
        <div className="mx-1 h-6 w-px bg-gray-300" />
        <button
          type="button"
          onClick={() => toggleFormat('code')}
          className={`rounded p-1.5 hover:bg-gray-200 ${editor.isActive('code') ? 'bg-gray-200' : ''}`}
          title="Code"
        >
          <Code size={16} />
        </button>
        <button
          type="button"
          onClick={() => toggleFormat('blockquote')}
          className={`rounded p-1.5 hover:bg-gray-200 ${editor.isActive('blockquote') ? 'bg-gray-200' : ''}`}
          title="Quote"
        >
          <Quote size={16} />
        </button>
        <button
          type="button"
          onClick={() => toggleFormat('link')}
          className={`rounded p-1.5 hover:bg-gray-200 ${editor.isActive('link') ? 'bg-gray-200' : ''}`}
          title="Add Link"
        >
          <LinkIcon size={16} />
        </button>
      </div>

      <EditorContent editor={editor} className="p-3" />
    </div>
  );
}
