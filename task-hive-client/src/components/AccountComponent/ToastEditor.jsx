import React, { useRef } from 'react';
import { Editor } from '@toast-ui/react-editor';
import '@toast-ui/editor/dist/toastui-editor.css';

export default function ToastEditor() {
  const editorRef = useRef();

  const getMarkdown = () => {
    const md = editorRef.current.getInstance().getMarkdown();
    alert(md);
  };

  return (
    <div style={{ maxWidth: '600px', margin: '20px auto' }}>
      <Editor
        ref={editorRef}
        height="200px"
        initialEditType="wysiwig"
        previewStyle={null}
        hideModeSwitch={true}
        useCommandShortcut={true}
        initialValue="**Привет, мир!**"
      />

      <div style={{ marginTop: '20px', display: 'flex', gap: '10px' }}>
        <button onClick={getMarkdown}>Получить Markdown</button>
      </div>
    </div>
  );
}
