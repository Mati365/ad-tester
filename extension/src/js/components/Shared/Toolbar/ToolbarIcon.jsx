import c from 'classnames';
import * as R from 'ramda';

import {basicInjectSheet} from '../../../helpers';
import {
  withProps,
  omitProps,
  watchHover,
} from '../../../decorators';

import ExposedIcon from '../ExposedIcon';
import {TOOLBAR_HEIGHT} from './ToolbarHeader';

const css = {
  toolbarIcon: {
    verticalAlign: 'middle',
    margin: '0 4px',
    lineHeight: `${TOOLBAR_HEIGHT}px`,
  },
  hoveredToolbarIcon: {
    cursor: 'pointer',
  },
};

export default R.compose(
  basicInjectSheet(css),
  watchHover,
  withProps(
    ({classes, hovered, className}) => ({
      className: c(
        className,
        classes.toolbarIcon,
        hovered && classes.hoveredToolbarIcon,
      ),
    }),
    true,
  ),
  omitProps([
    'classes',
    'hovered',
  ]),
)(ExposedIcon);
