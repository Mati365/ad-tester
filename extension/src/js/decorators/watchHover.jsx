import React from 'react';
import PropTypes from 'prop-types';

export default Component => (
  class extends React.PureComponent {
    static displayName = 'watchHover()';

    static propTypes = {
      disableHoverEvents: PropTypes.bool,
    };

    static defaultProps = {
      disableHoverEvents: false,
    };

    state = {
      hovered: false,
      disableHoverEvents: false,
    };

    onMouseEnter = () => this.setState({hovered: true});

    onMouseLeave = () => this.setState({hovered: false});

    static getDerivedStateFromProps(props, state) {
      const {disableHoverEvents} = props;
      if (state.disableHoverEvents !== disableHoverEvents) {
        return {
          disableHoverEvents,
          hovered: disableHoverEvents
            ? false
            : state.hovered,
        };
      }

      return null;
    }

    render() {
      const {hovered} = this.state;
      const {disableHoverEvents, ...props} = this.props;

      return (
        <Component
          {...props}
          {...!disableHoverEvents && {
            onMouseEnter: this.onMouseEnter,
            onMouseLeave: this.onMouseLeave,
          }}
          hovered={hovered}
        />
      );
    }
  }
);
