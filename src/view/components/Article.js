import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';

Article.propTypes = {
  title: PropTypes.string.isRequired,
  publishedAt: PropTypes.string.isRequired,
  link: PropTypes.string.isRequired,
  type: PropTypes.string.isRequired,
}

export default function Article({
  title,
  publishedAt,
  link,
  type,
}) {
  const favicon = href => `https://icons.better-idea.org/icon?url=${href}&size=80..120..200`;
  return (
    <div className="article">
      <img class="favicon" src={favicon(type)}>
      <div>
        <a href={link}>{title}</a>
        <p>Published: {moment(publishedAt).fromNow()}</p>
      </div>
    </div>
  );
}
