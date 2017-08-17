import React from 'react';
import PropTypes from 'prop-types';

export default function LoadingButton({ isLoading, goNextPage }) {
  return (
    <div className="show-more">
      <button className="button--nostyle" onClick={goNextPage}>
        {isLoading
          ? <div className="button__loader" />
          : 'More'
        }
      </button>
    </div>
  );
}

LoadingButton.propTypes = {
  goNextPage: PropTypes.func.isRequired,
};
