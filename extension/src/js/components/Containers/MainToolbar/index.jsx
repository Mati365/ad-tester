import React from 'react';
import ReactDOM from 'react-dom';
import {connect} from 'react-redux';
import * as R from 'ramda';

import AD_SCHEMA from '../../../constants/adSchema';
import {TOOLBAR_BORDER} from '../../../constants/colors';
import {
  Actions,
  activeAdSelector,
} from '../../../redux/adModule';

import {
  toggleable,
  wrap,
  withAppStore,
} from '../../../decorators';

import Toolbar, {ToolbarIcon, TOOLBAR_HEIGHT} from '../../Shared/Toolbar';
import {
  Resizable,
  WatchWindowResize,
  CenteredLayer,
  ExposedIcon,
} from '../../Shared';

import MaximizeGroup from './MaximizeGroup';
import StickyGroup from './StickyGroup';
import AdEditor from './AdEditor';
import EditorFooter from './EditorFooter';

const getInitialDimensions = R.once(() => {
  const [w, h] = [
    window.innerWidth * 0.4,
    TOOLBAR_HEIGHT + 150,
  ];

  return {
    x: window.innerWidth - w,
    y: window.innerHeight - h,
    w,
    h,
  };
});

@withAppStore
@connect(
  ({ads}) => ({
    toggled: !R.isNil(ads.active),
    activeUUID: ads.active,
    ad: activeAdSelector(ads),
  }),
  dispatch => ({
    editAd: (...args) => dispatch(Actions.editAd(...args)),
    blurAd: () => dispatch(Actions.blurAd()),
  }),
)
@wrap(
  (Component, props) => (
    <Resizable initialDimensions={getInitialDimensions()}>
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
  editorRef = React.createRef();

  static propTypes = {
    ad: AD_SCHEMA.isRequired,
  };

  componentDidUpdate(prevProps) {
    if (prevProps.activeUUID !== this.props.activeUUID)
      this.onFocusInput();
  }

  onSetMinimize = (minimized) => {
    const {dimensions, onSetDimensions} = this.props;
    const h = (
      minimized
        ? TOOLBAR_HEIGHT
        : window.innerHeight / 2
    );

    onSetDimensions({
      ...dimensions,
      y: window.innerHeight - h,
      h,
    });
  };

  onWindowResize = (wnd) => {
    const {dimensions, onSetDimensions} = this.props;

    onSetDimensions({
      ...dimensions,
      x: wnd.w - dimensions.w,
      y: wnd.h - dimensions.h,
    });
  };

  onFocusInput = () => {
    const textField = ReactDOM
      .findDOMNode(this.editorRef.current)
      .querySelector('textarea');

    if (textField)
      textField.focus();
  };

  onEditAd = (newCode) => {
    this.props.editAd(
      this.props.activeUUID,
      {
        code: newCode,
      },
    );
  };

  get minimized() {
    const {dimensions} = this.props;
    return !dimensions || dimensions.h <= TOOLBAR_HEIGHT;
  }

  render() {
    const {minimized} = this;
    const {
      dimensions, resizing, handles, withRef,
      sticky, ad, blurAd,
      onSetDimensions,
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
            <AdEditor
              withRef={this.editorRef}
              value={ad.code}
              onChange={this.onEditAd}
              onEditorLoaded={this.onFocusInput}
            />
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
            alignItems: 'inherit',
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
          style={{
            ...!styleDimensions && {
              transition: 'height 200ms ease-in-out',
            },
            ...styleAttach,
            ...styleDimensions,
          }}
          panel={panel}
          rightPanel={(
            <>
              <MaximizeGroup
                minimized={minimized}
                onSetMinimize={this.onSetMinimize}
              />
              <ToolbarIcon
                type='close'
                onClick={blurAd}
              />
            </>
          )}
          footer={!minimized && (
            <EditorFooter ad={ad} />
          )}
        >
          {content}
        </Toolbar>
      </WatchWindowResize>
    );
  }
}
