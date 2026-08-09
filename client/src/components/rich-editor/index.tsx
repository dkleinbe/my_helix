import Highlight from '@tiptap/extension-highlight';
//import Underline from '@tiptap/extension-underline';
import { useState, useCallback} from 'react';
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
 
  
  const [opened, handlers] = useDisclosure(false, {
    onOpen: () => console.log('Opened'),
    onClose: () => console.log('Closed'),
  });



  const editor = useEditor({
    extensions: [StarterKit, Highlight],
    content: content,
    onUpdate: (() => {
      onChange(editor)
    }),
    onDestroy: (() => { 
      // TODO: Add save/cancel dialog
      console.log("Editor destroyed") 
      
          /*
          handlers.open();
          modals.openConfirmModal({
            title: 'Please confirm your action',
            children: (
              <Text size="sm">
                This action is so important that you are required to confirm it with a modal. Please click
                one of these buttons to proceed.
              </Text>
            ),
            labels: { confirm: 'Confirm', cancel: 'Cancel' },
            onCancel: () => console.log('Cancel'),
            onConfirm: () => console.log('Confirmed'),
          });
          */
      
    })

  });


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
