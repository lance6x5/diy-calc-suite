import * as calc from './calc.js';
import Form from './DrywallForm.jsx';

/** Calculator module descriptor consumed by the app shell (see README: "Adding a calculator"). */
export default {
  id: 'drywall',
  title: 'Drywall',
  description: 'Drywall sheets, screws, joint compound and tape for a room.',
  defaults: calc.defaults,
  calculate: calc.calculate,
  present: calc.present,
  formula: calc.formula,
  Form
};
