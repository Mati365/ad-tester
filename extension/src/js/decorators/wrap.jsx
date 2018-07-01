export default fn => (Component) => {
  const Wrapped = props => fn(
    Component,
    props,
  );

  Wrapped.displayName = 'wrap()';

  return Wrapped;
};
