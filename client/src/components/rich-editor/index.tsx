import Highlight from '@tiptap/extension-highlight';
//import Underline from '@tiptap/extension-underline';
import { useEffect} from 'react';
import { Editor, useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { RichTextEditor } from '@mantine/tiptap';


//const content = '<p>Subtle rich text editor variant</p>';

interface RichTextEditorProps {
  content: string;
  onChange: (editor: Editor) => void;
}

const HelixRichEditor = ({content, onChange} : RichTextEditorProps) => {
 
  
  const editor = useEditor({
    extensions: [StarterKit, Highlight],
    content: content,
    
    onUpdate: (() => {
      
        onChange(editor)

    }),

  });


  useEffect(() => {
    // do not send updateEvent when content is new
    //sendUpdateEvent = false

    if (editor) {

      editor.commands.setContent(content)

    }
  }, [content, editor])

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
