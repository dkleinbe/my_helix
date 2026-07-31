import { useParams } from "react-router";
import { Biodatas } from './biodatas.tsx';
import { Grid } from '@mantine/core';
import { PatientAccounting } from './accounting.tsx';
import { PatientAppointments } from './appointments.tsx';
import { ContactNavBar } from './header.tsx';
import { ContactProvider } from './context.tsx';
import { useContact } from './logic.ts';

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
          <Biodatas form={form} />
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
