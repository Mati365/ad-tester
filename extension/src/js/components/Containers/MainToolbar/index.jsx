import React from 'react';

import {TOOLBAR_BORDER} from '../../../constants/colors';

import {
  toggleable,
  wrap,
} from '../../../decorators';

import Toolbar, {TOOLBAR_HEIGHT} from '../../Shared/Toolbar';
import {
  Resizable,
  WatchWindowResize,
  CenteredLayer,
  ExposedIcon,
} from '../../Shared';

import MaximizeGroup from './MaximizeGroup';
import StickyGroup from './StickyGroup';
import AdEditor from './AdEditor';

const INITIAL_DIMENSIONS = (() => {
  const [w, h] = [
    window.innerWidth * 0.4,
    TOOLBAR_HEIGHT,
  ];

  return {
    x: window.innerWidth - w,
    y: window.innerHeight - h,
    w,
    h,
  };
})();

@wrap(
  (Component, props) => (
    <Resizable initialDimensions={INITIAL_DIMENSIONS}>
      {(ref, handles, dimensions, sticky, resizing, setters) => (
        <Component
          withRef={ref}
          {...{
            handles, sticky, resizing, dimensions,
          }}
          {...setters}
          {...props}
        />
      )}
    </Resizable>
  ),
)
@toggleable({
  unmountNotToggled: true,
  initialToggle: true,
})
export default class ToggleableToolbar extends React.PureComponent {
  onSetMinimize = (minimized) => {
    const {dimensions, onSetDimensions} = this.props;
    if (minimized)
      onSetDimensions(null);
    else {
      const h = window.innerHeight / 2;

      onSetDimensions({
        ...dimensions,
        y: window.innerHeight - h,
        h,
      });
    }
  };

  onWindowResize = (wnd) => {
    const {dimensions, onSetDimensions} = this.props;

    onSetDimensions({
      ...dimensions,
      x: wnd.w - dimensions.w,
      y: wnd.h - dimensions.h,
    });
  };

  get minimized() {
    const {dimensions} = this.props;
    return !dimensions || dimensions.h <= TOOLBAR_HEIGHT;
  }

  render() {
    const {minimized} = this;
    const {
      dimensions, resizing, handles, withRef,
      sticky, onSetDimensions,
    } = this.props;

    let content = null;
    if (!minimized) {
      content = (
        resizing
          ? (
            <CenteredLayer>
              <ExposedIcon
                type='resize'
                style={{
                  width: 20,
                  height: 20,
                }}
              />
            </CenteredLayer>
          )
          : (
            <AdEditor />
          )
      );
    }

    const styleDimensions = {
      left: dimensions.x,
      top: dimensions.y,

      height: `${dimensions.h}px`,
      width: `${dimensions.w}px`,
    };

    const styleAttach = {
      right: 0,
      left: 'initial',
      ...!sticky.w && {
        borderLeft: `1px solid ${TOOLBAR_BORDER}`,
      },
    };

    const panel = (
      <>
        <span
          style={{
            display: 'inherit',
            marginRight: 8,
          }}
        >
          <StickyGroup
            {...{dimensions, sticky, onSetDimensions}}
          />
          {handles.left}
        </span>
        {handles.top}
      </>
    );

    return (
      <WatchWindowResize
        throttleScroll={false}
        watchScroll={false}
        onResize={this.onWindowResize}
      >
        <Toolbar
          withRef={withRef}
          panel={panel}
          style={{
            ...!styleDimensions && {
              transition: 'height 200ms ease-in-out',
            },
            ...styleAttach,
            ...styleDimensions,
          }}
          rightPanel={(
            <MaximizeGroup
              minimized={minimized}
              onSetMinimize={this.onSetMinimize}
            />
          )}
        >
          {content}
        </Toolbar>
      </WatchWindowResize>
    );
  }
}
