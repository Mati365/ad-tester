import React from 'react';
import PropTypes from 'prop-types';
import c from 'classnames';

import basicInjectSheet from '../../../helpers/basicInjectSheet';

import {
  WatchWindowResize,
  CenteredLayer,
  OutlinedText,
} from '../../Shared';

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
};

@basicInjectSheet(css)
export default class AdLayer extends React.PureComponent {
  static propTypes = {
    element: PropTypes.instanceOf(Element).isRequired,
  };

  constructor(props) {
    super(props);

    this.state = {
      dimensions: getElementDimensions(props.element),
    };
  }

  componentDidMount() {
    setInterval(
      this.onResize,
      2000,
    );
  }

  onResize = () => {
    this.setState({
      dimensions: getElementDimensions(this.props.element),
    });
  };

  render() {
    const {
      element, classes, className, style,
      ...props
    } = this.props;

    const {dimensions} = this.state;
    if (dimensions.height * dimensions.width === 0)
      return null;

    return (
      <WatchWindowResize onResize={this.onResize}>
        <div
          {...props}
          className={c(
            classes.adLayer,
            className,
          )}
          style={{
            ...style,
            ...dimensions,
          }}
        >
          <CenteredLayer>
            <AdEdit
              titled={dimensions.width >= 150}
            />
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
        </div>
      </WatchWindowResize>
    );
  }
}
