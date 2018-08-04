import {styled} from '../../helpers/basicInjectSheet';

const OutlinedText = styled(
  'span',
  {
    root: {
      fontFamily: 'Verdana,sans-serif',
      fontSize: 12,
      color: '#fff',
      textShadow: '-1px -1px 0 #000, 1px -1px 0 #000, -1px 1px 0 #000, 1px 1px 0 #000',
      '-webkit-font-smoothing': 'initial',
    },
  },
);

OutlinedText.displayName = 'OutlinedText';

export default OutlinedText;
