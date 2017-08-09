import React from 'react';
import PropTypes from 'prop-types';

Options.propTypes = {
  activeFeeds: PropTypes.arrayOf(PropTypes.string).isRequired,
  availableSources: PropTypes.arrayOf(PropTypes.shape({
    name: PropTypes.string.isRequired,
    faviconURL: PropTypes.string.isRequired,
    host: PropTypes.string.isRequired,
    type: PropTypes.string.isRequired,
  })).isRequired,
  toggleActiveFeed: PropTypes.func.isRequired,
};

export default function Options({
  availableSources,
  activeFeeds,
  toggleActiveFeed,
}) {
  const styles = {
    active: {
      opacity: 1,
      maxWidth: 20,
    },
    inactive: {
      opacity: 0.2,
      maxWidth: 20,
    },
  };
  // TODO: filter out all feed burner links, need to provide the real url back
  //       in data folder
  const sourceToggles = availableSources.map(({ name, faviconURL, type }) => (
    <input
      key={type}
      type="image"
      src={faviconURL}
      onClick={toggleActiveFeed}
      alt={`Toggle ${name}`}
      title={name}
      data-feed={type}
      style={activeFeeds.includes(type) ? styles.active : styles.inactive}
    />
  ));

  return (
    <div className="options">
      Feeds: {sourceToggles}
    </div>
  );
}
