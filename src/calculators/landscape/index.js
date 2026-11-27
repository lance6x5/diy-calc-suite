import * as calc from './calc.js';
import Form from './LandscapeForm.jsx';

/** Calculator module descriptor consumed by the app shell (see README: "Adding a calculator"). */
export default {
  id: 'landscape',
  title: 'Mulch / Gravel / Soil',
  description: 'Bulk or bagged landscape material for a bed or path.',
  defaults: calc.defaults,
  calculate: calc.calculate,
  present: calc.present,
  formula: calc.formula,
  Form
};
