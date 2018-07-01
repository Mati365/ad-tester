import React from 'react';

const generateUUID = (() => {
  let counter = 0;

  return (prefix) => {
    counter += 1;

    return `${prefix}-${counter}-${Date.now()}`;
  };
})();

export default (prefix = 'UUID') => Component => (
  class extends React.Component {
    uuid = generateUUID(prefix);

    static displayName = `uuid(${prefix})`;

    render() {
      return (
        <Component
          {...this.props}
          uuid={this.uuid}
        />
      );
    }
  }
);
