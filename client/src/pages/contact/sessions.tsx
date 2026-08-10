import { Button, Grid, Timeline, UnstyledButton } from "@mantine/core";
import { ISession } from "../../types/interfaces";
import HelixRichEditor from "../../components/rich-editor";
import { Session } from "./session.tsx"
import { Editor } from "@tiptap/react";
import { confirmLeaveModal } from "../../components/modal-confirm-leave";
import { useState } from "react";


function SessionTimeLine({data, onSelect} : {data: ISession[], onSelect : (id: number) => void} ) {

  if (data.length === 0)
    return (
      <h4>No session</h4>
    )

  const items = data.map((item, index) => 
        <Timeline.Item title={<UnstyledButton size="sm" onClick={() => onSelect(index)}>
                          {item.type}
                          </UnstyledButton>}>
          <UnstyledButton  size="sm" value={1}>
            {item.mode}
          </UnstyledButton>
      </Timeline.Item>
  )
  return (
    <Timeline active={items.length - 1} bulletSize={24}>
      {items}
    </Timeline>
  );  
}

const Sessions = ({ sessions } : { sessions: ISession[]}) => {
    
    const [sessionIndex, setSessionIndex] = useState(sessions.length - 1)
    const [prevSession, setPreviousSession] = useState(sessionIndex)
    const [session, setSession] = useState(sessions[sessions.length - 1])
    const [isDirty, setIsDirty] = useState(false)
    const [editor, setEditor] = useState<Editor>()
    const notesChanged = (editor: Editor) => { 
        // do not set dirty if it is not the same session 
        // i.e when the sessions changes the new notes fire the event and we do not want
        // to set it dirty
        if (prevSession === sessionIndex)
            setIsDirty(true); 
        setEditor(editor)
        setPreviousSession(sessionIndex)
        console.log('Dirty...: ' + isDirty); 
    }
    //
    // Select the last session to start with
    //
    const si = sessionIndex >= 0 ? sessionIndex : sessions.length -1
    if (sessionIndex !== si) {
        setSessionIndex(si)
        setSession(sessions[si])
    }
    const onSessionSelect = (id: number) => {
        console.log('Session : ' + id)
        setPreviousSession(sessionIndex)
        if (id !== sessionIndex) {
            if (isDirty) {
                confirmLeaveModal(() => {}, () => { 
                    setSessionIndex(id)
                    setSession(sessions[id])
                    setIsDirty(false)})
            }
            else {
                setSessionIndex(id)
                setSession(sessions[id])
                setIsDirty(false); 
            }
        }
    }
    return (
        <Grid columns={12}>
        <Grid.Col span={2}>
            <SessionTimeLine data={sessions} onSelect={onSessionSelect}/>    
        </Grid.Col>
        <Grid.Col span={10}>
            <Session session={session} onChange={() => setIsDirty(true)}/>
        </Grid.Col>                
        </Grid>
    )
}

export { Sessions }