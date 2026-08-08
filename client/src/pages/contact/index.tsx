import { useParams } from "react-router";
import { Biodatas } from './biodatas.tsx';
import { Grid, Tabs, Timeline, Text, UnstyledButton  } from '@mantine/core';
import { PatientAccounting } from './accounting.tsx';
//import { PatientAppointments } from './appointments.tsx';
import { ContactNavBar } from './header.tsx';
import { ContactProvider } from './context.tsx';
import { useContact } from './logic.ts';
import HelixRichEditor from '../../components/rich-editor';
import { ISession } from "../../types/interfaces.ts";
import { JSONContent } from "@tiptap/react";

function TimeLine({data} : {data: ISession[]} ) {

  if (data.length === 0)
    return (
      <h4>No session</h4>
    )

  const items = data.map(item => 
        <Timeline.Item title={item.type}>
        <UnstyledButton c="dimmed" size="sm">
         {item.mode}
        </UnstyledButton>
      </Timeline.Item>
  )

  return (
    <Timeline bulletSize={24}>
      {items}
    </Timeline>
  );
}



const Contact = () => {
  //const id = window.location.href.split('/').slice(-1)[0];
  let params = useParams();

  const id = params.contactID ? params.contactID : "0"
  const saveNotes = (notes: JSONContent) => { console.log('Saving...'); console.log(notes)}

  const { form, sessions, transactions } = useContact(id);
  return (
    <ContactProvider>
      <Grid columns={12}>
        <ContactNavBar form={form} />
        <Grid.Col span={8}>
          <Tabs defaultValue="biodata">
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
                  <TimeLine data={sessions}/>    
                </Grid.Col>
                <Grid.Col span={10}>
                  <HelixRichEditor value='coucou' onSave={saveNotes}/>    
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
    </ContactProvider>
  );
};

export default Contact;
