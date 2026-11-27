import * as calc from './calc.js';
import Form from './FlooringForm.jsx';

/** Calculator module descriptor consumed by the app shell (see README: "Adding a calculator"). */
export default {
  id: 'flooring',
  title: 'Flooring / Tile',
  description: 'Boxes of tile or plank flooring for an area.',
  defaults: calc.defaults,
  calculate: calc.calculate,
  present: calc.present,
  formula: calc.formula,
  Form
};
