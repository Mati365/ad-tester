import React from 'react';
import PropTypes from 'prop-types';

import {generateUUID} from '../helpers';

export default (prefix = 'UUID') => Component => (
  class extends React.Component {
    static displayName = `uuid(${prefix})`;

    static propTypes = {
      uuid: PropTypes.string,
    }

    static defaultProps = {
      uuid: null,
    };

    constructor(props) {
      super(props);
      this.state = {
        uuid: props.uuid || generateUUID(prefix),
      };
    }

    render() {
      return (
        <Component
          {...this.props}
          {...this.state}
        />
      );
    }
  }
);
