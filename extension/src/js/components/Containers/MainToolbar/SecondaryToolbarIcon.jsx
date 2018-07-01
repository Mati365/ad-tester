import {withProps} from '../../../decorators';
import {ToolbarIcon} from '../../Shared/Toolbar';

const SecondaryToolbarIcon = withProps(
  ({style}) => ({
    style: {
      marginRight: 11,
      height: 14,
      width: 14,
      ...style,
    },
  }),
  true,
)(ToolbarIcon);

SecondaryToolbarIcon.displayName = 'SecondaryToolbarIcon';

export default SecondaryToolbarIcon;
