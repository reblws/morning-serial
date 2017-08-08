import React from 'react';
import moment from 'moment';

export default function Article({
  title,
  publishedAt,
  link,
}) {
  return (
    <div className="article">
      <a href={link}>{title}</a>
      <p>Published: {moment(publishedAt).fromNow()}</p>
    </div>
  );
}
