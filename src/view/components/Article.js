import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import { Clock } from 'react-feather';
import url from 'url-parse';

Article.propTypes = {
  title: PropTypes.string.isRequired,
  publishedAt: PropTypes.oneOfType([
    PropTypes.instanceOf(Date),
    PropTypes.string,
  ]).isRequired,
  link: PropTypes.string.isRequired,
  // type: PropTypes.string.isRequired,
  favicon: PropTypes.string.isRequired,
  type: PropTypes.string.isRequired,
};

export default function Article({
  title,
  publishedAt,
  link,
  favicon,
  type,
}) {
  const { hostname, href } = url(link);
  return (
    <div className="article">
      <div className="article__media">
        <img className="favicon" src={favicon} alt={type} title={type} />
      </div>
      <div>
        <a className="article__link" href={href} target="_blank" rel="noreferrer noopener">{title}</a> <a href={hostname} className="article__hostname">{hostname}</a>
        <p className="article__info">
          <time title={publishedAt} dateTime={publishedAt}>
            <Clock size={12} /> {moment(publishedAt).fromNow()}
          </time>
        </p>
      </div>
    </div>
  );
}
