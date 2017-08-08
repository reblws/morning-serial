import React from 'react';
import PropTypes from 'prop-types';
import Article from './Article';

Listing.propTypes = {
  latestArticles: PropTypes.arrayOf(
    PropTypes.shape({
      link: PropTypes.string.isRequired,
      publishedAt: PropTypes.string.isRequired,
      title: PropTypes.string.isRequired,
      type: PropTypes.string.isRequired,
      uuid: PropTypes.string.isRequired,
    }),
  ).isRequired,
};

export default function Listing({ latestArticles }) {
  const articles = latestArticles.map(article =>
    <Article
      key={article.uuid}
      {...article}
    />
  );
  return (
    <section className="listing">
      { articles }
    </section>
  );
}
