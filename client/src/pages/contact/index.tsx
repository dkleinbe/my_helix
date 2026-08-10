import { useParams } from "react-router";
import { useState, useCallback} from 'react';
import { Blocker, BlockerFunction, useBlocker } from 'react-router-dom';
import { Biodatas } from './biodatas.tsx';
import { Grid, Tabs, Text } from '@mantine/core';
import { modals  } from '@mantine/modals';
import { PatientAccounting } from './accounting.tsx';
//import { PatientAppointments } from './appointments.tsx';
import { ContactNavBar } from './header.tsx';
import { ContactProvider } from './context.tsx';
import { useContact } from './logic.ts';
import { Sessions } from "./sessions.tsx";



const Contact = () => {
  //const id = window.location.href.split('/').slice(-1)[0];
  const params = useParams();
  const id = params.contactID ? params.contactID : "0"
  const [isDirty, setIsDirty] = useState(false)
  const { form, sessions, transactions } = useContact(id);

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
              <Sessions sessions={sessions} />
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
