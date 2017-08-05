import React from 'react';
import moment from 'moment';

export default function Article({
  title,
  publishedAt,
  link,
}) {
  return (
    <div>
      <h2><a href={link}>{title}</a></h2>
      <p>Published: {moment(publishedAt).fromNow()}</p>
    </div>
  );
}
