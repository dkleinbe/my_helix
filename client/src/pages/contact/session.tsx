import { Button  } from "@mantine/core";
import { UseFormReturnType } from '@mantine/form';
import { ISession } from "../../types/interfaces";
import HelixRichEditor from "../../components/rich-editor";
import { Editor } from "@tiptap/react";
import { confirmLeaveModal } from "../../components/modal-confirm-leave";
import { useState } from "react";
import { useSession } from "./session.logic";


const Session = ({ session, onChange }: { session: ISession, onChange: () => void }) => {
    
    const { form } = useSession(session)
    const [prevSession, setPreviousSession] = useState(session)
    const [isDirty, setIsDirty] = useState(false)
    const [editor, setEditor] = useState<Editor>()
    const notesChanged = (editor: Editor) => { 
        // do not set dirty if it is not the same session 
        // i.e when the sessions changes the new notes fire the event and we do not want
        // to set it dirty
        if (prevSession === session) {
            setIsDirty(true);
            onChange()
        } else {
            setIsDirty(false)
            setPreviousSession(session)
        }
            
        setEditor(editor)
        
        
        console.log('isDirty !...: ' + isDirty); 
    }
    


    return (
        <>
            <Button 
                variant="filled" 
                disabled={!isDirty}
                onClick={() => { setIsDirty(false); console.log(editor ? editor.getJSON(): 'no conent')}}
            >
                save
            </Button>
            <HelixRichEditor content={session ? session.notes : 'no note'} onChange={notesChanged}/>   
        </> 

    )
}

export { Session }