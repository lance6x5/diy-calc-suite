import * as calc from './calc.js';
import Form from './DeckForm.jsx';

/** Calculator module descriptor consumed by the app shell (see README: "Adding a calculator"). */
export default {
  id: 'deck',
  title: 'Deck boards',
  description: 'Deck boards and joists for a rectangular deck.',
  defaults: calc.defaults,
  calculate: calc.calculate,
  present: calc.present,
  formula: calc.formula,
  Form
};
