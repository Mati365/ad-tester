import React from 'react';
import PropTypes from 'prop-types';

const throttle = (timeout, fn) => {
  let lastCall = null;
  let previousReturn = null;

  return (...args) => {
    const call = !lastCall || Date.now() - lastCall >= timeout;

    if (call) {
      lastCall = Date.now();
      previousReturn = fn(...args);
    }

    return previousReturn;
  };
};

export const pickWindowSize = () => ({
  w: window.innerWidth,
  h: window.innerHeight,
});

export default class WatchWindowResize extends React.Component {
  static propTypes = {
    throttleScroll: PropTypes.bool,
    watchScroll: PropTypes.bool,
    onResize: PropTypes.func.isRequired,
  };

  static defaultProps = {
    throttleScroll: true,
    watchScroll: true,
  };

  constructor(props) {
    super(props);
    this.onScroll = props.throttleScroll
      ? throttle(200, this.onResize)
      : this.onResize;
  }

  componentDidMount() {
    window.addEventListener('resize', this.onResize);
    if (this.props.watchScroll)
      window.addEventListener('scroll', this.onScroll);
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.onResize);
    window.removeEventListener('scroll', this.onScroll);
  }

  onResize = () => {
    const {onResize} = this.props;
    if (!onResize)
      return;

    onResize(pickWindowSize());
  };

  render() {
    return React.Children.only(this.props.children);
  }
}
