import React from 'react';
import PropTypes from 'prop-types';
import { ChevronDown } from 'react-feather';

export default function LoadingButton({ isLoading, goNextPage }) {
  return (
    <div className="show-more">
      <button className="button--nostyle" onClick={goNextPage}>
        {isLoading
          ? <div className="button__loader" />
          : <div><strong>More</strong><br /><ChevronDown aria-hidden="true" /></div>
        }
      </button>
    </div>
  );
}

LoadingButton.propTypes = {
  goNextPage: PropTypes.func.isRequired,
};
