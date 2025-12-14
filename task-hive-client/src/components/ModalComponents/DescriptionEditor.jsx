// // DescriptionEditor.jsx
// import React from 'react';
// import { useEditor, EditorContent } from '@tiptap/react';
// import StarterKit from '@tiptap/starter-kit';
// import './DescriptionEditor.css'; // Файл стилей (см. ниже)

// const DescriptionEditor = ({ initialValue, onChange }) => {
//   const editor = useEditor({
//     extensions: [
//       StarterKit, // Включает Bold, Italic, Code, Heading, List и т.д.
//     ],
//     content: initialValue || '', // Начальный контент
//     editorProps: {
//       attributes: {
//         class: 'prose prose-sm sm:prose focus:outline-none', // Если используешь Tailwind
//       },
//     },
//     onUpdate: ({ editor }) => {
//       // Здесь мы получаем HTML.
//       // Если бэкенду нужен именно Markdown, читай "Важный нюанс" ниже.
//       const html = editor.getHTML();
//       onChange(html);
//     },
//   });

//   if (!editor) {
//     return null;
//   }

//   return (
//     <div className="editor-container">
//       {/* Само поле редактора */}
//       <EditorContent editor={editor} />
//     </div>
//   );
// };

// export default DescriptionEditor;

// DescriptionEditor.jsx
import React from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import './DescriptionEditor.css';

const MenuBar = ({ editor }) => {
  if (!editor) {
    return null;
  }

  // Вспомогательная функция для назначения класса кнопке
  // Если стиль активен (например, курсор на жирном), добавляем класс 'is-active'
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
    <div className="editor-container">
      {/* Сначала рендерим меню */}
      <MenuBar editor={editor} />

      {/* Потом сам редактор */}
      <div className="editor-content">
        <EditorContent editor={editor} />
      </div>
    </div>
  );
};

export default DescriptionEditor;
