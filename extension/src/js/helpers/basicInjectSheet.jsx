import React from 'react';
import injectSheet from 'react-jss';
import c from 'classnames';

const basicInjectSheet = styles => injectSheet(
  styles,
  {inject: ['classes']},
);

export const styled = (Component, css, classSelector, mergeProps) => {
  const Wrapped = ({classes, className, ...props}) => (
    <Component
      {...props}
      {...mergeProps && mergeProps(props)}
      className={c(
        classes.root,
        className,
        classSelector && classSelector(classes, props),
      )}
    />
  );

  return basicInjectSheet(css)(Wrapped);
};

export default basicInjectSheet;
