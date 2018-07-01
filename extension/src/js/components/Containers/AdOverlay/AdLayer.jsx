import React from 'react';
import PropTypes from 'prop-types';
import c from 'classnames';
import {connect} from 'react-redux';
import * as R from 'ramda';

import {
  basicInjectSheet,
  replaceAdSlot,
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

import {Actions} from '../../../redux/adModule';
import AdEdit from './AdEdit';

const getElementDimensions = (element) => {
  const rect = element.getBoundingClientRect();

  return {
    left: rect.left + window.scrollX,
    top: rect.top + window.scrollY,
    width: rect.width,
    height: rect.height,
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
  ({ads: {codes, active}}, {uuid}) => ({
    code: codes[uuid],
    editing: active === uuid,
  }),
  (dispatch, {uuid}) => ({
    registerAd: () => dispatch(Actions.registerAd(uuid)),
    focusAd: () => dispatch(Actions.focusAd(uuid)),
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
    this.setState({
      dimensions: getElementDimensions(this.element),
    });
  };

  injectCode() {
    this.element = replaceAdSlot(this.element, this.props.code);
    this.onResize();
  }

  render() {
    const {
      classes, className, style,
      focusAd, editing,
    } = this.props;

    const {dimensions} = this.state;
    const editBtn = (
      <AdEdit
        titled={dimensions.width >= 150}
        editing={editing}
        onClick={focusAd}
      />
    );

    let content = null;

    if (dimensions.height * dimensions.width === 0 || editing)
      return null;

    if (!editing) {
      content = (
        <CenteredLayer>
          {editBtn}
          <OutlinedText
            style={{
              fontSize: 12,
              textAlign: 'center',
            }}
          >
            {dimensions.height >= 120 && (
              <div style={{marginBottom: 2}}>
                {chrome.i18n.getMessage('ad_creation_dimensions')}
              </div>
            )}
            {`${Number.parseInt(dimensions.width, 10)}px : ${Number.parseInt(dimensions.height, 10)}px`}
          </OutlinedText>
        </CenteredLayer>
      );
    }

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
            ...dimensions,
          }}
        >
          {content}
        </div>
      </WatchWindowResize>
    );
  }
}
