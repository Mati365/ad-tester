import PropTypes from 'prop-types';
import c from 'classnames';
import * as R from 'ramda';

import {basicInjectSheet} from '../../../helpers';
import {
  withProps,
  omitProps,
} from '../../../decorators';

import ExposedIcon from '../ExposedIcon';

const css = {
  resizeHandle: {
    width: 12,
    height: 12,
  },
  horizontal: {
    transform: 'rotateZ(90deg)',
    cursor: 'ew-resize',
  },
  vertical: {
    marginLeft: 'auto',
    cursor: 'ns-resize',
  },
};

const ResizeHandle = R.compose(
  basicInjectSheet(css),
  withProps(
    ({vertical, classes}) => ({
      draggable: false,
      type: 'bars',
      className: c(
        classes.resizeHandle,
        classes[vertical ? 'vertical' : 'horizontal'],
      ),
    }),
    true,
  ),
  omitProps([
    'vertical',
    'classes',
  ]),
)(ExposedIcon);

ResizeHandle.displayName = 'ResizeHandle';

ResizeHandle.propTypes = {
  vertical: PropTypes.bool,
};

ResizeHandle.defaultProps = {
  vertical: true,
};

export const HorizontalResizeHandle = withProps(
  {
    vertical: false,
  },
  true,
)(ResizeHandle);

export default ResizeHandle;
