import _Ajv from 'ajv';
const Ajv = _Ajv as unknown as typeof _Ajv.default;

import schemaPatientCreate from './schemas/create-patient.json' with { type: "json" };
import schemaPatientUpdate from './schemas/update-patient.json' with { type: "json" };
import schemaAppointmentCreate from './schemas/create-appointment.json' with { type: "json" };
import schemaAppointmentUpdate from './schemas/update-appointment.json' with { type: "json" };
import schemaAddAppointment from './schemas/add-appointment.json' with { type: "json" };
import schemaSessionCreate from './schemas/create-appointment.json' with { type: "json" };
import schemaSessionUpdate from './schemas/update-appointment.json' with { type: "json" };
import schemaUserCreate from './schemas/create-user.json' with { type: "json" };
import schemaUserUpdate from './schemas/update-user.json' with { type: "json" };
import schemaContactCreate from './schemas/create-contact.json' with { type: "json" };
import schemaContactUpdate from './schemas/update-contact.json' with { type: "json" };
import schemaLogin from './schemas/login.json' with { type: "json" };
import schemaAccountingCreate from './schemas/create-accounting.json' with { type: "json" };
import schemaEventCreate from './schemas/create-event.json' with { type: "json" };

const ajv = new Ajv();

// Add formats for specific data types

export default {
  patientCreate: ajv.compile(schemaPatientCreate),
  patientUpdate: ajv.compile(schemaPatientUpdate),
  appointmentCreate: ajv.compile(schemaAppointmentCreate),
  sessionCreate: ajv.compile(schemaSessionCreate),
  eventCreate: ajv.compile(schemaEventCreate),
  appointmentUpdate: ajv.compile(schemaSessionUpdate),
  sessionUpdate: ajv.compile(schemaAppointmentUpdate),
  addAppointment: ajv.compile(schemaAddAppointment),
  userCreate: ajv.compile(schemaUserCreate),
  userUpdate: ajv.compile(schemaUserUpdate),
  contactCreate: ajv.compile(schemaContactCreate),
  contactUpdate: ajv.compile(schemaContactUpdate),  
  login: ajv.compile(schemaLogin),
  accountingCreate: ajv.compile(schemaAccountingCreate),
};
