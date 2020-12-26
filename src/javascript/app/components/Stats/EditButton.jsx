import React from 'react';
import PropTypes from 'prop-types';

const EditButton = ({ updateParam, paramKey }) => (
  <button
    type="button"
    className="stats__edit-param"
    onClick={() => updateParam(paramKey)}
  >
    Edit
  </button>
);

EditButton.propTypes = {
  updateParam: PropTypes.func.isRequired,
  paramKey: PropTypes.string.isRequired,
};

EditButton.defaultProps = {
};

export default EditButton;
