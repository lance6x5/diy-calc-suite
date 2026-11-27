import * as calc from './calc.js';
import Form from './PaintForm.jsx';

/** Calculator module descriptor consumed by the app shell (see README: "Adding a calculator"). */
export default {
  id: 'paint',
  title: 'Paint',
  description: 'Paint for one or more walls, minus doors and windows.',
  defaults: calc.defaults,
  calculate: calc.calculate,
  present: calc.present,
  formula: calc.formula,
  Form
};
