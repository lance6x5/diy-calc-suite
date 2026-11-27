import * as calc from './calc.js';
import Form from './ConcreteForm.jsx';

/** Calculator module descriptor consumed by the app shell (see README: "Adding a calculator"). */
export default {
  id: 'concrete',
  title: 'Concrete',
  description: 'Concrete for a slab, round footings or solid steps.',
  defaults: calc.defaults,
  calculate: calc.calculate,
  present: calc.present,
  formula: calc.formula,
  Form
};
