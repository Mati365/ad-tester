import PropTypes from 'prop-types';

export default PropTypes.shape({
  code: PropTypes.string,
  dimensions: PropTypes.shape({
    w: PropTypes.number,
    h: PropTypes.number,
  }),
});
