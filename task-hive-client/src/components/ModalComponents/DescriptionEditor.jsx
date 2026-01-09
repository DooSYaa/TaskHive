import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import './DescriptionEditor.css';
import Button from '../ButtonComponent/Button';

const MenuBar = ({ editor }) => {
  if (!editor) {
    return null;
  }
  const getBtnClass = activeCheck =>
    activeCheck ? 'menu-btn is-active' : 'menu-btn';

  return (
    <div className="menu-bar">
      {/* Жирный */}
      <button
        onClick={() => editor.chain().focus().toggleBold().run()}
        disabled={!editor.can().chain().focus().toggleBold().run()}
        className={getBtnClass(editor.isActive('bold'))}
      >
        <b>B</b>
      </button>

      {/* Курсив */}
      <button
        onClick={() => editor.chain().focus().toggleItalic().run()}
        disabled={!editor.can().chain().focus().toggleItalic().run()}
        className={getBtnClass(editor.isActive('italic'))}
      >
        <i>I</i>
      </button>

      <span className="divider">|</span>

      {/* Заголовок H1 */}
      <button
        onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
        className={getBtnClass(editor.isActive('heading', { level: 1 }))}
      >
        H1
      </button>

      {/* Заголовок H2 */}
      <button
        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
        className={getBtnClass(editor.isActive('heading', { level: 2 }))}
      >
        H2
      </button>

      <button
        onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
        className={getBtnClass(editor.isActive('heading', { level: 3 }))}
      >
        H3
      </button>

      <button
        onClick={() => editor.chain().focus().toggleHeading({ level: 4 }).run()}
        className={getBtnClass(editor.isActive('heading', { level: 4 }))}
      >
        H4
      </button>

      <button
        onClick={() => editor.chain().focus().toggleHeading({ level: 5 }).run()}
        className={getBtnClass(editor.isActive('heading', { level: 5 }))}
      >
        H5
      </button>

      <button
        onClick={() => editor.chain().focus().toggleHeading({ level: 6 }).run()}
        className={getBtnClass(editor.isActive('heading', { level: 6 }))}
      >
        H6
      </button>

      <span className="divider">|</span>

      {/* Маркированный список */}
      <button
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        className={getBtnClass(editor.isActive('bulletList'))}
      >
        Bullet lsit •
      </button>

      {/* Нумерованный список */}
      <button
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
        className={getBtnClass(editor.isActive('orderedList'))}
      >
        Ordered lsit 1.
      </button>
    </div>
  );
};

const DescriptionEditor = ({ initialValue, onChange }) => {
  const editor = useEditor({
    extensions: [StarterKit],
    content: initialValue || '',
    editorProps: {
      attributes: {
        class: 'prose focus:outline-none',
      },
    },
    onUpdate: ({ editor }) => {
      const html = editor.getHTML();
      onChange(html);
    },
  });

  return (
    <div
      className="w-full flex flex-col items-center"
      style={{ padding: '20px' }}
    >
      <div className="editor-container">
        <MenuBar editor={editor} />

        <div className="editor-content">
          <EditorContent editor={editor} />
        </div>
      </div>
      <div
        className="w-full flex gap-2"
        style={{ marginTop: '5px', marginLeft: '76px' }}
      >
        <Button>Save</Button>
        <Button>Cancel</Button>
      </div>
    </div>
  );
};

export default DescriptionEditor;
