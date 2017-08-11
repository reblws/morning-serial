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
  // toggleOptions: PropTypes.func.isRequired,
  showOptions: PropTypes.bool.isRequired,
};

export default function Options({
  availableSources,
  activeFeeds,
  toggleActiveFeed,
  showOptions,
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
    hidden: {
      visibility: 'hidden',
    },
  };
  // TODO: filter out all feed burner links, need to provide the real url back
  //       in data folder
  const sourceToggles = availableSources.map(({ name, faviconURL, type }) => {
    const classList = ['options__source-toggle'];
    const isActive = activeFeeds.includes(type);

    if (isActive) {
      classList.push('options__source-toggle--inactive');
    }

    return (
      <div className="options__source-toggle" key={type}>
        <img
          className="options__source-favicon"
          src={faviconURL}
          alt={`Toggle ${name}`}
          title={name}
          data-feed={type}
          style={isActive ? styles.active : styles.inactive}
        />
        {name}
      </div>
    );
  });

  return (
    <div className="options" style={showOptions ? {} : styles.hidden}>
      {sourceToggles}
    </div>
  );
}
