import React from 'react';
import PropTypes from 'prop-types';
import * as R from 'ramda';

import VISIBILITY_STATE from '../../constants/toolbarVisibilityState';
import {TOOLBAR_BORDER} from '../../constants/colors';

import hasFlag, {addFlag, removeFlag} from '../../helpers/hasFlag';
import {
  withProps,
  toggleable,
} from '../../decorators';

import Toolbar, {ToolbarIcon, TOOLBAR_HEIGHT} from '../Shared/Toolbar';

const ToggleableIcon = ({
  toggled, onSetToggle, toggleFlags,
  ...props
}) => {
  let test = true;

  if (R.is(Function, toggleFlags.activeOnFlag))
    test = toggleFlags.activeOnFlag(toggled);
  else
    test = hasFlag(toggleFlags.activeOnFlag, toggled);

  return (
    test
      ? (
        <ToolbarIcon
          {...props}
          onClick={
            () => onSetToggle(
              R.compose(
                removeFlag(toggleFlags.activeOnFlag),
                addFlag(toggleFlags.setOnToggle),
              )(toggled),
            )
          }
        />
      )
      : null
  );
};

ToggleableIcon.displayName = 'ToggleableIcon';

ToggleableIcon.propTypes = {
  toggleFlags: PropTypes.shape({
    setOnToggle: PropTypes.number,
    activeOnFlag: PropTypes.oneOfType([
      PropTypes.number,
      PropTypes.func,
    ]),
  }).isRequired,

  onSetToggle: PropTypes.func.isRequired,
};

const ToggleableSecondaryIcon = withProps(
  {
    style: {
      marginRight: 11,
      height: 14,
      width: 14,
    },
  },
)(ToggleableIcon);

const ExpandGroup = ({
  toggled, style, toggleFlag,
  onSetToggle,
}) => (
  <>
    <ToggleableSecondaryIcon
      type='arrow-right'
      toggleFlags={{
        activeOnFlag: () => !hasFlag(toggleFlag, toggled),
        setOnToggle: toggleFlag,
      }}
      {...{toggled, style, onSetToggle}}
    />
    <ToggleableSecondaryIcon
      type='arrow-left'
      toggleFlags={{
        activeOnFlag: toggleFlag,
        setOnToggle: toggled,
      }}
      {...{toggled, style, onSetToggle}}
    />
  </>
);

@toggleable({
  unmountNotToggled: true,
  initialToggle: VISIBILITY_STATE.MINIMIZED,
})
export default class MainToolbar extends React.PureComponent {
  state = {
    contentHeight: 400,
  };

  componentDidUpdate(prevProps) {
    if (this.props.toggled !== prevProps.toggled)
      document.body.style.marginBottom = `${this.totalContentHeight}px`;
  }

  get maximized() {
    return hasFlag(VISIBILITY_STATE.MAXIMIZED, this.props.toggled);
  }

  get totalContentHeight() {
    return (
      this.maximized
        ? this.state.contentHeight + TOOLBAR_HEIGHT
        : TOOLBAR_HEIGHT
    );
  }

  render() {
    const {maximized} = this;
    const {contentHeight} = this.state;
    const {toggled, onSetToggle} = this.props;

    let content = null;
    if (maximized) {
      content = (
        <div style={{height: contentHeight}} />
      );
    }

    return (
      <Toolbar
        style={{
          transition: 'height 200ms ease-in-out',
          height: this.totalContentHeight,
          ...hasFlag(VISIBILITY_STATE.TRUNCATED_LEFT, toggled) && {
            width: '50vw',
            right: 0,
            left: 'initial',
            borderLeft: `1px solid ${TOOLBAR_BORDER}`,
          },
          ...!maximized && {
            borderBottomWidth: 0,
          },
        }}
        panel={
          <>
            <ExpandGroup
              {...{toggled, onSetToggle}}
              toggleFlag={VISIBILITY_STATE.TRUNCATED_LEFT}
              style={{
                width: 12,
                height: 12,
              }}
            />
          </>
        }
        rightPanel={
          <>
            <ToggleableSecondaryIcon
              type='window-maximize'
              toggleFlags={{
                activeOnFlag: VISIBILITY_STATE.MINIMIZED,
                setOnToggle: VISIBILITY_STATE.MAXIMIZED,
              }}
              {...{toggled, onSetToggle}}
            />
            <ToggleableSecondaryIcon
              type='window-minimize'
              toggleFlags={{
                activeOnFlag: VISIBILITY_STATE.MAXIMIZED,
                setOnToggle: VISIBILITY_STATE.MINIMIZED,
              }}
              {...{toggled, onSetToggle}}
            />
            <ToolbarIcon type='close' />
          </>
        }
      >
        {content}
      </Toolbar>
    );
  }
}
