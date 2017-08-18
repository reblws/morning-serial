import React from 'react';
import PropTypes from 'prop-types';

Options.propTypes = {
  activeFeeds: PropTypes.arrayOf(PropTypes.string).isRequired,
  availableSources: PropTypes.arrayOf(PropTypes.shape({
    name: PropTypes.string.isRequired,
    host: PropTypes.string.isRequired,
    type: PropTypes.string.isRequired,
  })).isRequired,
  toggleActiveFeed: PropTypes.func.isRequired,
  // toggleOptions: PropTypes.func.isRequired,
  showOptions: PropTypes.bool.isRequired,
  getFavicon: PropTypes.func.isRequired,
};

export default function Options({
  availableSources,
  activeFeeds,
  toggleActiveFeed,
  showOptions,
  getFavicon,
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
  const sourceToggles = availableSources
    .sort((a, b) => {
      // Sort ascending
      const formatString = s => s.name.toUpperCase().replace(/the/i, '').trim();
      const aString = formatString(a);
      const bString = formatString(b);
      if (aString < bString) {
        return -1;
      } else if (aString > bString) {
        return 1;
      }
      return 0;
    })
    .map(({ name, type }) => {
      const sourceToggleClassList = ['options__source-toggle'];
      const isActive = activeFeeds.includes(type);
      if (!isActive) {
        sourceToggleClassList.push('options__source-toggle--inactive');
      }

      return (
        <div
          className={sourceToggleClassList.join(' ')}
          role="checkbox"
          aria-checked={isActive}
          tabIndex="0"
          key={type}
          data-feed={type}
          onClick={toggleActiveFeed}
        >
          <img
            className="options__source-favicon"
            src={getFavicon(type)}
            alt={`Toggle ${name}`}
            title={name}
            style={isActive ? styles.active : styles.inactive}
          />
          <span className="options__source-name">{name}</span>
        </div>
      );
    });

  const optionsClassList = ['options'];
  if (showOptions) {
    optionsClassList.push('options--visible');
  } else {
    optionsClassList.push('options--hidden');
  }
  return (
    <div className={optionsClassList.join(' ')}>
      {sourceToggles}
    </div>
  );
}
