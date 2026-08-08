import Highlight from '@tiptap/extension-highlight';
//import Underline from '@tiptap/extension-underline';
import { useState } from 'react';
import { JSONContent, useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { RichTextEditor } from '@mantine/tiptap';
import { Button, Modal } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';

const content = '<p>Subtle rich text editor variant</p>';

interface RichTextEditorProps {
  value: string;
  onSave: (notes: JSONContent) => void;
}

const HelixRichEditor = ({value, onSave} : RichTextEditorProps) => {
 
  const [isDirty, setIsDirty] = useState(false)
  const [opened, handlers] = useDisclosure(false, {
    onOpen: () => console.log('Opened'),
    onClose: () => console.log('Closed'),
  });
  const editor = useEditor({
    extensions: [StarterKit, Highlight],
    content: value,
    onUpdate: (() => {
      setIsDirty(true)
      //handlers.open();
    }),
    onDestroy: (() => { 
      // TODO: Add save/cancel dialog
      console.log("Editor destroyed") 
      
      if (isDirty) {
          console.log('Notes needs saving')
          console.log(editor.getJSON())
          handlers.open();
      }
    })

  });


  return (
    <>  
    <Button 
      variant="filled" 
      disabled={!isDirty}
      onClick={() => { onSave(editor.getJSON()); setIsDirty(false)}}
    >
      save
    </Button>
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
    <Modal opened={opened} onClose={close} title="Authentication" centered>
        {/* Modal content */}
    </Modal>      
    </>
  );
};

export default HelixRichEditor;
