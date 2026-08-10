import Highlight from '@tiptap/extension-highlight';
//import Underline from '@tiptap/extension-underline';
import { useState, useCallback, useEffect} from 'react';
import { Editor, JSONContent, useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { RichTextEditor } from '@mantine/tiptap';
import { Button, Modal, Text } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { modals  } from '@mantine/modals';
import { BlockerFunction, useBlocker } from 'react-router-dom';

const content = '<p>Subtle rich text editor variant</p>';

interface RichTextEditorProps {
  content: string;
  onChange: (editor: Editor) => void;
}

const HelixRichEditor = ({content, onChange} : RichTextEditorProps) => {
 
  let sendUpdateEvent = true
  const editor = useEditor({
    extensions: [StarterKit, Highlight],
    content: content,
    
    onUpdate: (() => {
      if (sendUpdateEvent)
        onChange(editor)
      sendUpdateEvent =true
    }),

  });


  useEffect(() => {
    // do not send updateEvent when content is new
    sendUpdateEvent = false

    if (editor) {

      editor.commands.setContent(content)

    }
  }, [content])

  return (
    <RichTextEditor editor={editor} variant="subtle">
      <RichTextEditor.Toolbar sticky stickyOffset={60}>
        <RichTextEditor.ControlsGroup>
          <RichTextEditor.Bold />
          <RichTextEditor.Italic />
          {/*<RichTextEditor.Underline />*/}
          <RichTextEditor.Strikethrough />
          {/*<RichTextEditor.ClearFormatting />*/}
          <RichTextEditor.Highlight />
        </RichTextEditor.ControlsGroup>
      </RichTextEditor.Toolbar>

      <RichTextEditor.Content />
    </RichTextEditor>    
  );
};

export default HelixRichEditor;
