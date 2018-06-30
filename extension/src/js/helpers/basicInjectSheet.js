import injectSheet from 'react-jss';

export default styles => injectSheet(
  styles,
  {inject: ['classes']},
);
