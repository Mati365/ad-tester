import React from 'react';
import PropTypes from 'prop-types';
import c from 'classnames';
import {connect} from 'react-redux';
import * as R from 'ramda';

import {
  basicInjectSheet,
  replaceAdSlot,
  toStringDimensions,
  throttle,
} from '../../../helpers';

import {
  assignUID,
  withAppStore,
} from '../../../decorators';

import {
  WatchWindowResize,
  CenteredLayer,
  OutlinedText,
} from '../../Shared';

import {
  Actions,
  adCodeSelector,
} from '../../../redux/adModule';

import AdEdit from './AdEdit';

const getElementDimensions = (element) => {
  const rect = element.getBoundingClientRect();

  return {
    x: rect.left + window.scrollX,
    y: rect.top + window.scrollY,
    w: rect.width,
    h: rect.height,
  };
};

/**
 * Layer visible on ad, it updates position when user scrolls.
 * It should be displayed on top of page instead of local div
 * due to css and tag structure integrity
 *
 * @export
 */
const css = {
  adLayer: {
    position: 'absolute',
    boxSizing: 'border-box',
    zIndex: 9999999,
    background: 'rgba(255, 0, 0, 0.5)',
    border: '2px solid #FF0000',
  },
  editedAdLayer: {
    background: 'initial',
    border: '1px dashed rgba(0, 0, 0, 0.45)',
  },
};

@withAppStore
@assignUID('AD')
@connect(
  ({ads}, {uuid}) => ({
    code: adCodeSelector(uuid, ads),
    editing: ads.active === uuid,
  }),
  (dispatch, {uuid}) => ({
    editAd: (...args) => dispatch(Actions.editAd(uuid, ...args)),
    registerAd: () => dispatch(Actions.registerAd(uuid)),
    focusAd: (dimensions) => {
      dispatch(
        Actions.focusAd(
          uuid,
          {dimensions},
        ),
      );
    },
  }),
)
@basicInjectSheet(css)
export default class AdLayer extends React.PureComponent {
  static propTypes = {
    element: PropTypes.instanceOf(Element).isRequired, // element might be replaced
    editing: PropTypes.bool,
  };

  static defaultProps = {
    editing: false,
  };

  constructor(props) {
    super(props);

    this.element = props.element;
    this.state = {
      dimensions: getElementDimensions(this.element),
    };

    const throttledInject = throttle(
      200, this.injectCode,
    );

    this.injectCode = () => {
      this.element.srcdoc = '';
      throttledInject();
    };
  }

  componentDidMount() {
    if (R.isNil(this.props.code))
      this.props.registerAd();
    else if (this.props.editing)
      this.injectCode();

    setInterval(
      this.onResize,
      2000,
    );
  }

  componentDidUpdate(prevProps) {
    if ((prevProps.code !== this.props.code && this.props.editing)
        || (!prevProps.editing && this.props.editing))
      this.injectCode();
  }

  onResize = () => {
    const dimensions = getElementDimensions(this.element);
    if (R.equals(dimensions, this.state.dimensions))
      return;

    if (this.props.editing)
      this.onFocus();

    this.setState({
      dimensions,
    });
  };

  onFocus = () => {
    this.props.focusAd(this.state.dimensions);
  };

  injectCode = () => {
    const {
      detailsPromise,
      element,
    } = replaceAdSlot(this.element, this.props.code);

    this.element = element;
    this.onResize();

    if (detailsPromise) {
      detailsPromise.then((details) => {
        this.props.editAd({
          details,
        });
      });
    }
  }

  render() {
    const {
      classes, className, style, editing,
    } = this.props;

    const {dimensions} = this.state;
    if (dimensions.h * dimensions.w === 0 || dimensions.h < 10 || editing)
      return null;

    const editBtn = (
      <AdEdit
        titled={
          dimensions.w >= 150
        }
        editing={editing}
        onClick={this.onFocus}
      />
    );

    const content = (
      <CenteredLayer>
        {editBtn}
        <OutlinedText
          style={{
            fontSize: 12,
            textAlign: 'center',
          }}
        >
          {dimensions.h >= 120 && (
            <div style={{marginBottom: 2}}>
              {chrome.i18n.getMessage('ad_creation_dimensions')}
            </div>
          )}
          {toStringDimensions(dimensions)}
        </OutlinedText>
      </CenteredLayer>
    );

    return (
      <WatchWindowResize onResize={this.onResize}>
        <div
          className={c(
            classes.adLayer,
            editing && classes.editedAdLayer,
            className,
          )}
          style={{
            ...style,
            left: dimensions.x,
            top: dimensions.y,
            width: dimensions.w,
            height: dimensions.h,
          }}
        >
          {content}
        </div>
      </WatchWindowResize>
    );
  }
}
