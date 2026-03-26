import { useEditor, EditorContent } from '@tiptap/react';
import { Markdown } from 'tiptap-markdown';
import StarterKit from '@tiptap/starter-kit';
import './DescriptionEditor.css';
import { Button, Flex, Separator } from '@radix-ui/themes';
import { ListBulletIcon } from '@radix-ui/react-icons';

const MenuBar = ({ editor }) => {
  if (!editor) {
    return null;
  }
  const getBtnClass = activeCheck =>
    activeCheck ? 'menu-btn is-active' : 'menu-btn';

  return (
    <div className="menu-bar">
      {/* Жирный */}
      <Button
        size={'1'}
        variant={'surface'}
        onClick={() => editor.chain().focus().toggleBold().run()}
        disabled={!editor.can().chain().focus().toggleBold().run()}
        className={getBtnClass(editor.isActive('bold'))}
      >
        <b>B</b>
      </Button>

      {/* Курсив */}
      <Button
        size={'1'}
        variant={'surface'}
        onClick={() => editor.chain().focus().toggleItalic().run()}
        disabled={!editor.can().chain().focus().toggleItalic().run()}
        className={getBtnClass(editor.isActive('italic'))}
      >
        <i>I</i>
      </Button>

      <Separator orientation={'vertical'} />

      {/* Заголовок H1 */}
      <Button
        size={'1'}
        variant={'surface'}
        onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
        className={getBtnClass(editor.isActive('heading', { level: 1 }))}
      >
        H1
      </Button>

      {/* Заголовок H2 */}
      <Button
        size={'1'}
        variant={'surface'}
        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
        className={getBtnClass(editor.isActive('heading', { level: 2 }))}
      >
        H2
      </Button>

      <Button
        size={'1'}
        variant={'surface'}
        onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
        className={getBtnClass(editor.isActive('heading', { level: 3 }))}
      >
        H3
      </Button>

      <Button
        size={'1'}
        variant={'surface'}
        onClick={() => editor.chain().focus().toggleHeading({ level: 4 }).run()}
        className={getBtnClass(editor.isActive('heading', { level: 4 }))}
      >
        H4
      </Button>

      <Button
        size={'1'}
        variant={'surface'}
        onClick={() => editor.chain().focus().toggleHeading({ level: 5 }).run()}
        className={getBtnClass(editor.isActive('heading', { level: 5 }))}
      >
        H5
      </Button>

      <Button
        size={'1'}
        variant={'surface'}
        onClick={() => editor.chain().focus().toggleHeading({ level: 6 }).run()}
        className={getBtnClass(editor.isActive('heading', { level: 6 }))}
      >
        H6
      </Button>

      <Separator orientation={'vertical'} />

      {/* Маркированный список */}
      <Button
        size={'1'}
        variant={'surface'}
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        className={getBtnClass(editor.isActive('bulletList'))}
      >
        <ListBulletIcon />
      </Button>

      {/* Нумерованный список */}
      <Button
        size={'1'}
        variant={'surface'}
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
        className={getBtnClass(editor.isActive('orderedList'))}
      >
        1.
      </Button>
    </div>
  );
};

const DescriptionEditor = ({ initialValue, onChange, onSave, onCancel }) => {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: { levels: [1, 2, 3, 4, 5, 6] },
      }),
      Markdown,
    ],
    content: initialValue || '',
    editorProps: {
      attributes: {
        class: 'prose focus:outline-none',
      },
    },
    onUpdate: ({ editor }) => {
      const markdown = editor.storage.markdown.getMarkdown();
      if (onChange) {
        onChange(markdown);
      }
    },
  });
  const handleSave = () => {
    if (editor) {
      const markdown = editor.storage.markdown.getMarkdown();
      console.log('Saving markdown', markdown);
      if (onSave) {
        onSave(markdown);
      }
      if (onChange) {
        onChange(markdown);
      }
    }
  };
  const handleCancel = () => {
    if (onCancel) {
      onCancel();
    }
    if (editor) {
      editor.commands.setContent(initialValue || '');
    }
  };
  return (
    <Flex
      direction={'column'}
      align={'center'}
      width={'100%'}
      px={'10px'}
      py={'5px'}
    >
      <Flex
        direction={'column'}
        overflow={'hidden'}
        width={'100%'}
        className="editor-container"
      >
        <MenuBar editor={editor} />

        <div className="editor-content">
          <EditorContent editor={editor} />
        </div>
      </Flex>
      <Flex width={'100%'} gap={'2'} mt={'5px'}>
        <Button variant="soft" onClick={handleSave}>
          Save
        </Button>
        <Button variant="soft" onClick={handleCancel}>
          Cancel
        </Button>
      </Flex>
    </Flex>
  );
};

export default DescriptionEditor;
