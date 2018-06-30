import React from 'react';

import VISIBILITY_STATE from '../../../constants/toolbarVisibilityState';
import {TOOLBAR_BORDER} from '../../../constants/colors';

import hasFlag from '../../../helpers/hasFlag';
import {toggleable} from '../../../decorators';

import Toolbar, {TOOLBAR_HEIGHT} from '../../Shared/Toolbar';
import ExpandGroup from './ExpandGroup';
import MaximizeGroup from './MaximizeGroup';
import {Resizable} from '../../Shared';

@toggleable({
  unmountNotToggled: true,
  initialToggle: (
    VISIBILITY_STATE.MINIMIZED
      | VISIBILITY_STATE.TRUNCATED
      | VISIBILITY_STATE.ATTACH_RIGHT
  ),
})
export default class MainToolbar extends React.PureComponent {
  componentDidUpdate(prevProps) {
    if (this.props.toggled !== prevProps.toggled)
      document.body.style.marginBottom = `${this.totalContentHeight}px`;
  }

  get maximized() {
    return hasFlag(VISIBILITY_STATE.MAXIMIZED, this.props.toggled);
  }

  render() {
    const {maximized} = this;
    const {toggled, onSetToggle} = this.props;

    let content = null;
    if (maximized) {
      content = (
        <div style={{height: 200}} />
      );
    }

    return (
      <Resizable>
        {(ref, handles, dimensions) => {
          const styleDimensions = dimensions
            ? {
              right: window.innerWidth - (dimensions.x + dimensions.w),
              bottom: window.innerHeight - (dimensions.y + dimensions.h),

              height: `${dimensions.h}px`,
              width: `${dimensions.w}px`,
            }
            : {
              width: '50vw',
              height: `${TOOLBAR_HEIGHT}px`,
            };

          if (!hasFlag(VISIBILITY_STATE.TRUNCATED, toggled))
            styleDimensions.width = '100vw';

          const styleAttach = {
            ...hasFlag(VISIBILITY_STATE.ATTACH_RIGHT, toggled) && {
              right: 0,
              left: 'initial',
              borderLeft: `1px solid ${TOOLBAR_BORDER}`,
            },

            ...hasFlag(VISIBILITY_STATE.ATTACH_LEFT, toggled) && {
              left: 0,
              right: 'initial',
              borderRight: `1px solid ${TOOLBAR_BORDER}`,
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
                {handles.left}
              </span>
              <ExpandGroup
                {...{toggled, onSetToggle}}
                toggleFlag={VISIBILITY_STATE.TRUNCATED}
                style={{
                  width: 12,
                  height: 12,
                }}
              />
              {handles.top}
            </>
          );

          return (
            <Toolbar
              withRef={ref}
              style={{
                ...!styleDimensions && {
                  transition: 'height 200ms ease-in-out',
                },
                ...(!dimensions && !maximized) && {
                  borderBottomWidth: 0,
                },
                ...styleAttach,
                ...styleDimensions,
              }}
              panel={panel}
              rightPanel={
                <MaximizeGroup {...{toggled, onSetToggle}} />
              }
            >
              {content}
            </Toolbar>
          );
        }}
      </Resizable>
    );
  }
}
