import React from 'react';
import PropTypes from 'prop-types';
import * as R from 'ramda';

import ResizeHandle, {HorizontalResizeHandle} from './ResizeHandle';

export {default as ResizeHandle} from './ResizeHandle';

const DIRECTION = {
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

export default class Resizable extends React.PureComponent {
  nodeRef = React.createRef();

  startMousePos = null;

  static propTypes = {
    edges: PropTypes.shape({
      top: PropTypes.bool,
      bottom: PropTypes.bool,
      left: PropTypes.bool,
      right: PropTypes.bool,
    }),
  };

  static defaultProps = {
    edges: {
      top: true,
      left: true,
      right: false,
      bottom: false,
    },
  };

  state = {
    resizeDirection: null,
    dimensions: null,
    delta: {
      x: 0,
      y: 0,
    },
  };

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

  onEndResize = () => {
    this.setState(
      state => ({
        resizeDirection: null,
        delta: null,
        dimensions: addVectorToDimensions(state.dimensions, state.delta),
      }),
    );
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
    const {delta, dimensions} = this.state;
    const {edges} = this.props;

    return this.props.children(
      this.nodeRef,
      bindResizeHandles(edges, this.onStartResize),
      delta && dimensions
        ? addVectorToDimensions(dimensions, delta)
        : dimensions,
    );
  }
}
