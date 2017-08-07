import React from 'react';

export default function Options({
  availableSources,
  activeFeeds,
  toggleActiveFeed
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
  const sourceToggles = availableSources.map(({ name, faviconURL, type }) => {
    return (
      <input
        key={type}
        type="image"
        src={faviconURL}
        onClick={toggleActiveFeed}
        alt={`Toggle ${name}`}
        data-feed={type}
        style={activeFeeds.includes(type) ? styles.active : styles.inactive}
      />
    )
  });
  return (
    <div>
      {sourceToggles}
    </div>
  );
}
