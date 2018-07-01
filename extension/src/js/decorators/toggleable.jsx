import React from 'react';
import PropTypes from 'prop-types';
import * as R from 'ramda';

export default ({
  unmountNotToggled = false,
  initialToggle = false,
  getToggleFromProps = R.always(undefined),
} = {}) => Component => (
  class extends React.PureComponent {
    static displayName = 'toggleable()';

    static propTypes = {
      toggled: PropTypes.oneOfType([
        PropTypes.object,
        PropTypes.bool,
      ]),
    };

    static defaultProps = {
      toggled: null,
    };

    state = {
      toggled: initialToggle,
    };

    onSetToggle = toggled => this.setState({
      toggled,
    });

    static getDerivedStateFromProps(props, state) {
      const newToggle = getToggleFromProps(props, state.toggled);
      if (newToggle !== undefined)
        return R.objOf('toggled', newToggle);

      if (!R.propSatisfies(R.isNil, 'toggled', props) && props.toggled !== state.toggled) {
        return {
          toggled: props.toggled,
        };
      }

      return null;
    }

    render() {
      const {toggled} = this.state;
      if (unmountNotToggled && !toggled)
        return null;

      return (
        <Component
          {...this.props}
          toggled={toggled}
          onSetToggle={this.onSetToggle}
        />
      );
    }
  }
);
