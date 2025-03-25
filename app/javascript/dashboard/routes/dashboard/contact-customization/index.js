import ContactFieldsManager from './pages/ContactFieldsManager';
import ContactFieldEditor from './pages/ContactFieldEditor';

export default [
  {
    path: 'contact-customization',
    name: 'contact_fields_manager',
    roles: ['administrator'],
    component: ContactFieldsManager,
  },
  {
    path: 'contact-customization/:fieldId',
    name: 'contact_field_editor',
    roles: ['administrator'],
    component: ContactFieldEditor,
  },
];
