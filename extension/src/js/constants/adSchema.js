import PropTypes from 'prop-types';

const RESOURCE_ANALYZE_ITEMS = {
  totalRequests: PropTypes.number,
  size: PropTypes.number,
};

const RESOURCE_ANALYZE_SCHEMA = PropTypes.shape(RESOURCE_ANALYZE_ITEMS);

const FRAME_DETAILS_SCHEMA = PropTypes.shape({
  id: PropTypes.any,
  ...RESOURCE_ANALYZE_ITEMS,
  details: PropTypes.shape({
    image: RESOURCE_ANALYZE_SCHEMA,
    script: RESOURCE_ANALYZE_SCHEMA,
    stylesheet: RESOURCE_ANALYZE_SCHEMA,
    media: RESOURCE_ANALYZE_SCHEMA,
    others: RESOURCE_ANALYZE_SCHEMA,
  }),
});

export default PropTypes.shape({
  code: PropTypes.string,
  dimensions: PropTypes.shape({
    w: PropTypes.number,
    h: PropTypes.number,
  }),
  details: FRAME_DETAILS_SCHEMA,
});
