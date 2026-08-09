import Highlight from '@tiptap/extension-highlight';
//import Underline from '@tiptap/extension-underline';
import { useState, useCallback} from 'react';
import { JSONContent, useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { RichTextEditor } from '@mantine/tiptap';
import { Button, Modal, Text } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { modals  } from '@mantine/modals';
import { BlockerFunction, useBlocker } from 'react-router-dom';

const content = '<p>Subtle rich text editor variant</p>';

interface RichTextEditorProps {
  value: string;
  onSave: (notes: JSONContent) => void;
}

const HelixRichEditor = ({value, onSave} : RichTextEditorProps) => {
 
  const [isDirty, setIsDirty] = useState(true)
  const [opened, handlers] = useDisclosure(false, {
    onOpen: () => console.log('Opened'),
    onClose: () => console.log('Closed'),
  });

  const [truc, setTruc] = useState("");
  const shouldBlock = useCallback<BlockerFunction>(
    () => isDirty === true,
    [isDirty]
  );

  const blocker = useBlocker(shouldBlock);

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
    {blocker.state === "blocked" ? (
        <>
          <p style={{ color: "red" }}>
            Blocked the last navigation to
          </p>
          <button
            type="button"
            onClick={() => blocker.proceed()}
          >
            Let me through
          </button>
          <button
            type="button"
            onClick={() => blocker.reset()}
          >
            Keep me here
          </button>
        </>
      ) : blocker.state === "proceeding" ? (
        <p style={{ color: "orange" }}>
          Proceeding through blocked navigation
        </p>
      ) : (
        <p style={{ color: "green" }}>
          Blocker is currently unblocked {blocker.state}
        </p>
      )}
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
