import React from 'react';

export default function Options({
  availableSources,
  activeFeeds,
  changeActiveFeed
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
  const sourceToggles = availableSources.map(({ name, faviconURL, type }) => {
    return (
      <input
        key={type}
        type="image"
        src={faviconURL}
        onClick={changeActiveFeed}
        alt={name}
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
