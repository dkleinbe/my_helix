import { useParams } from "react-router";
import { Biodatas } from './biodatas.tsx';
import { Grid, Tabs, Timeline, Text, UnstyledButton  } from '@mantine/core';
import { PatientAccounting } from './accounting.tsx';
import { PatientAppointments } from './appointments.tsx';
import { ContactNavBar } from './header.tsx';
import { ContactProvider } from './context.tsx';
import { useContact } from './logic.ts';
import HelixRichEditor from '../../components/rich-editor';

function TimeLine() {
  return (
    <Timeline bulletSize={24}>
      <Timeline.Item title="Default bullet">
        <UnstyledButton c="dimmed" size="sm">
          Default bullet without anything
        </UnstyledButton>
      </Timeline.Item>
      <Timeline.Item
        title="Avatar"
      >
        <Text c="dimmed" size="sm">
          Timeline bullet as avatar image
        </Text>
      </Timeline.Item>
      <Timeline.Item title="Icon" >
        <Text c="dimmed" size="sm">
          Timeline bullet as icon
        </Text>
      </Timeline.Item>
      <Timeline.Item
        title="ThemeIcon"
        bullet={<UnstyledButton size={12}>A</UnstyledButton>}
      >
        <Text c="dimmed" size="sm">
          Timeline bullet as ThemeIcon component
        </Text>
      </Timeline.Item>
    </Timeline>
  );
}

const Contact = () => {
  //const id = window.location.href.split('/').slice(-1)[0];
  let params = useParams();

  const id = params.contactID ? params.contactID : "0"

  const { form, appointments, transactions } = useContact(id);
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
                  <TimeLine />    
                </Grid.Col>
                <Grid.Col span={10}>
                  <HelixRichEditor />    
                </Grid.Col>                
              </Grid>

            </Tabs.Panel>  
            <Tabs.Panel value="relations">
              <HelixRichEditor />
            </Tabs.Panel>                                   
          </Tabs>
        </Grid.Col>       
        <Grid.Col span={4}>
          <PatientAccounting data={transactions} />
        </Grid.Col>
        <Grid.Col span={12}>
          <PatientAppointments data={appointments} />
        </Grid.Col>
      </Grid>
    </ContactProvider>
  );
};

export default Contact;
