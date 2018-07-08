import {styled} from '../../helpers/basicInjectSheet';

const CenteredLayer = styled(
  'div',
  {
    root: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      width: '100%',
      height: '100%',
    },
  },
);

CenteredLayer.displayName = 'CenteredLayer';

export default CenteredLayer;
