import { useParams } from "react-router";
import { useEffect, useState, useCallback} from 'react';
import { Blocker, BlockerFunction, useBlocker } from 'react-router-dom';
import { Biodatas } from './biodatas.tsx';
import { Button, Grid, Tabs, Timeline, Text, UnstyledButton  } from '@mantine/core';
import { modals  } from '@mantine/modals';
import { PatientAccounting } from './accounting.tsx';
//import { PatientAppointments } from './appointments.tsx';
import { ContactNavBar } from './header.tsx';
import { ContactProvider } from './context.tsx';
import { useContact } from './logic.ts';
import HelixRichEditor from '../../components/rich-editor';
import { ISession } from "../../types/interfaces.ts";
import { Editor } from "@tiptap/react";

function SeesionTimeLine({data, onSelect} : {data: ISession[], onSelect : (id: number) => void} ) {

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



const Contact = () => {
  //const id = window.location.href.split('/').slice(-1)[0];
  const params = useParams();
  const id = params.contactID ? params.contactID : "0"
  const [isDirty, setIsDirty] = useState(false)
  const [editor, setEditor] = useState<Editor>()
  const notesChanged = (editor: Editor) => { 

    setIsDirty(true); 
    setEditor(editor)
    console.log('Dirty...'); 
  }
  const { form, sessions, transactions } = useContact(id);
  const [sessionIndex, setSessionIndex] = useState(-1)
  const [sessionNotes, setSessionNotes] = useState('coucou')

  const onSessionSelect = (id: number) => {
    console.log('Session : ' + id)
    if (id !== sessionIndex) {
      if (isDirty) {
        confirmLeaveModal(() => {}, () => { 
          setSessionNotes((/*sessions[id].notes +*/ id).toString()); 
          setSessionIndex(id)
          setIsDirty(false)})
      }
      else {
        setSessionNotes((/*sessions[id].notes +*/ id).toString())
        setSessionIndex(id)
        setIsDirty(false); 
      }
    }
  }
  //onSessionSelect(sessionIndex)

  const shouldBlock = useCallback<BlockerFunction>(
    () => isDirty === true,
    [isDirty]
  );
  const blocker = useBlocker(shouldBlock);

  function confirmLeaveModal(onCancel : () => void, onConfirm : () => void) {
    modals.openConfirmModal({
        title: 'Please confirm your action',
        children: (
          <Text size="sm">
            Il y a des modifications non sauvegardées. Si vous continuez, les données seront perdues
          </Text>
        ),
        labels: { confirm: 'Continuer', cancel: 'Annuler' },
        onCancel: onCancel,
        onConfirm: onConfirm,
      })
  }

  const openConfirmModal = (blocker: Blocker) => { return (
    blocker.state === "blocked" ? (
      confirmLeaveModal(() => blocker.reset(), () => blocker.proceed())
    ) : blocker.state === "proceeding" ? (
      <p style={{ color: "orange" }}>
        Proceeding through blocked navigation
      </p>
    ) : (
      <p style={{ color: "green" }}>
        Blocker is currently unblocked {blocker.state}
      </p>
    ))
  }
  const [activeTab, setActiveTab] = useState<string | null>('biodata');
  const handleTabChange = (value: string | null) => {
    if (value !== activeTab) {
      if (isDirty )
        confirmLeaveModal(() => {}, () => { setActiveTab(value); setIsDirty(false)})
      else {
        setActiveTab(value);
      }
    }
  };

  return (
    <ContactProvider>
      <>
      {openConfirmModal(blocker)}
      <Grid columns={12}>
        <ContactNavBar form={form} />
        <Grid.Col span={8}>
          <Tabs value={activeTab} defaultValue="biodata" onChange={handleTabChange}>
            <Tabs.List>
              <Tabs.Tab value="biodata" >
                <h2>Biodata</h2>
              </Tabs.Tab>
              <Tabs.Tab value="file" >
                <h2>Dossier</h2>
              </Tabs.Tab>
              <Tabs.Tab value="relations" >
                <h2>Relations</h2>
              </Tabs.Tab>              
            </Tabs.List>
            <Tabs.Panel value="biodata">
              <Biodatas form={form} />
            </Tabs.Panel>
            <Tabs.Panel value="file">
              <Grid columns={12}>
                <Grid.Col span={2}>
                  <SeesionTimeLine data={sessions} onSelect={onSessionSelect}/>    
                </Grid.Col>
                <Grid.Col span={10}>
                  <Button 
                    variant="filled" 
                    disabled={!isDirty}
                    onClick={() => { setIsDirty(false); console.log(editor ? editor.getJSON(): 'no conent')}}
                  >
                    save
                </Button>
                  <HelixRichEditor content={sessionNotes} onChange={notesChanged}/>    
                </Grid.Col>                
              </Grid>

            </Tabs.Panel>  
            <Tabs.Panel value="relations">
              <h3>RELATIONS</h3>
            </Tabs.Panel>                                   
          </Tabs>
        </Grid.Col>       
        <Grid.Col span={4}>
          <PatientAccounting data={transactions} />
        </Grid.Col>
        <Grid.Col span={12}>
          
        </Grid.Col>
      </Grid>
      </>
    </ContactProvider>
  );
};

export default Contact;
