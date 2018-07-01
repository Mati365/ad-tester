import React from 'react';
import PropTypes from 'prop-types';
import * as R from 'ramda';

import {argReferenceMemoize} from '../../../helpers';
import ResizeHandle, {HorizontalResizeHandle} from './ResizeHandle';

export {default as ResizeHandle} from './ResizeHandle';

export const DIRECTION = {
  TOP: 'top',
  LEFT: 'left',
  RIGHT: 'right',
  BOTTOM: 'bottom',
};

const DirectionComponents = {
  [DIRECTION.TOP]: ResizeHandle,
  [DIRECTION.BOTTOM]: ResizeHandle,
  [DIRECTION.LEFT]: HorizontalResizeHandle,
  [DIRECTION.RIGHT]: HorizontalResizeHandle,
};

const bindResizeHandles = (enabledEdges, onStartResize) => R.mapObjIndexed(
  (Component, edge) => enabledEdges[edge] && (
    <Component
      onMouseDown={() => onStartResize(edge)}
    />
  ),
  DirectionComponents,
);

const getElementDimensions = (element) => {
  if (!element)
    return null;

  const bounds = element.getBoundingClientRect();
  return {
    x: bounds.left,
    w: bounds.width,
    h: bounds.height,
    y: bounds.top,
  };
};

const getMousePosition = e => ({
  x: e.screenX,
  y: e.screenY,
});

const addVectorToDimensions = (dimensions, delta) => ({
  x: dimensions.x + delta.x,
  y: dimensions.y + delta.y,
  w: dimensions.w - delta.x,
  h: dimensions.h - delta.y,
});

const clamp = (min, max, value) => (
  Math.min(Math.max(value, min), max)
);

const getStickyFlags = dimensions => ({
  w: dimensions.w >= window.innerWidth,
  h: dimensions.h >= window.innerHeight,
});

export const onSizeClamp = ({
  x, y, w, h,
}) => {
  const pos = {
    w: clamp(0, window.innerWidth, w),
    h: clamp(0, window.innerHeight, h),
  };

  return {
    ...pos,
    x: clamp(0, window.innerWidth - pos.w, x),
    y: clamp(0, window.innerHeight - pos.h, y),
  };
};

export default class Resizable extends React.PureComponent {
  nodeRef = React.createRef();

  startMousePos = null;

  static propTypes = {
    initialDimensions: PropTypes.shape({
      x: PropTypes.number,
      y: PropTypes.number,
      w: PropTypes.number,
      h: PropTypes.number,
    }),
    edges: PropTypes.shape({
      top: PropTypes.bool,
      bottom: PropTypes.bool,
      left: PropTypes.bool,
      right: PropTypes.bool,
    }),
    onSizeClamp: PropTypes.func,
  };

  static defaultProps = {
    initialDimensions: null,
    edges: {
      top: true,
      left: true,
      right: false,
      bottom: false,
    },
    onSizeClamp,
  };

  constructor(props) {
    super(props);
    this.state = {
      resizeDirection: null,
      dimensions: props.initialDimensions,
      sticky: {
        w: false,
        h: false,
      },
      delta: {
        x: 0,
        y: 0,
      },
    };
  }

  componentDidUpdate(prevProps, prevState) {
    const {resizeDirection} = this.state;
    if (prevState.resizeDirection === resizeDirection)
      return;

    if (R.isNil(resizeDirection))
      this.detachDocumentListeners();
    else
      this.attachDocumentListeners();
  }

  componentWillUnmount() {
    this.detachDocumentListeners();
  }

  onSetDimensions = (dimensions, checkSticky = false) => {
    const updater = state => ({
      sticky: (
        checkSticky
          ? getStickyFlags(dimensions)
          : state.sticky
      ),
      dimensions: R.compose(
        this.props.onSizeClamp,
        checkSticky
          ? R.identity
          : this.clampSticky,
        R.defaultTo(this.props.initialDimensions),
      )(dimensions),
    });

    this.setState(updater);
  }

  onStartResize = (resizeDirection) => {
    this.startMousePos = null;
    this.setState({
      resizeDirection,
      dimensions: getElementDimensions(this.nodeRef.current),
      delta: {
        x: 0,
        y: 0,
      },
    });
  }

  onMouseMove = (e) => {
    const mousePos = getMousePosition(e);

    // prevent reseting position, add margin
    if (R.isNil(this.startMousePos))
      this.startMousePos = mousePos;

    const delta = {
      x: 0,
      y: 0,
    };

    switch (this.state.resizeDirection) {
      case DIRECTION.BOTTOM:
      case DIRECTION.TOP:
        delta.y = mousePos.y - this.startMousePos.y;
        break;

      case DIRECTION.RIGHT:
      case DIRECTION.LEFT:
        delta.x = mousePos.x - this.startMousePos.x;
        break;

      default:
    }

    this.setState({
      delta,
    });
  }

  onSetSticky = sticky => this.setState({
    sticky,
  });

  onEndResize = () => {
    const updater = (state) => {
      const dimensions = R.compose(
        this.props.onSizeClamp,
        addVectorToDimensions,
      )(state.dimensions, state.delta);

      return {
        resizeDirection: null,
        delta: null,
        dimensions,
        sticky: getStickyFlags(dimensions),
      };
    };

    this.setState(updater);
  };

  getCachedResizeHandles = argReferenceMemoize(bindResizeHandles);

  clampSticky = (dimensions) => {
    const {sticky} = this.state;

    const newDimensions = {
      w: sticky.w ? window.innerWidth : dimensions.w,
      h: sticky.h ? window.innerHeight : dimensions.h,
    };

    if (newDimensions.w !== dimensions.w || newDimensions.h !== dimensions.h) {
      return {
        ...dimensions,
        ...newDimensions,
      };
    }

    return dimensions;
  };

  attachDocumentListeners = () => {
    document.addEventListener('mousemove', this.onMouseMove);
    document.addEventListener('mouseup', this.onEndResize);
  };

  detachDocumentListeners = () => {
    document.removeEventListener('mousemove', this.onMouseMove);
    document.removeEventListener('mouseup', this.onEndResize);
  };

  render() {
    const {delta, sticky, dimensions} = this.state;
    const {edges} = this.props;

    return this.props.children(
      this.nodeRef,
      this.getCachedResizeHandles(edges, this.onStartResize),
      delta && dimensions
        ? addVectorToDimensions(dimensions, delta)
        : dimensions,
      sticky,
      {
        onSetDimensions: this.onSetDimensions,
        onSetSticky: this.onSetSticky,
      },
    );
  }
}
