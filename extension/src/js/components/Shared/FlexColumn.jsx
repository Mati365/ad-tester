import {styled} from '../../helpers/basicInjectSheet';

const FlexColumn = styled(
  'div',
  {
    root: {
      display: 'flex',
    },
  },
);

FlexColumn.displayName = 'FlexColumn';

export default FlexColumn;
