import React from 'react';
import PropTypes from 'prop-types';
import Article from './Article';

Listing.propTypes = {
  latestArticles: PropTypes.arrayOf(
    PropTypes.shape({
      link: PropTypes.string.isRequired,
      publishedAt: PropTypes.instanceOf(Date).isRequired,
      title: PropTypes.string.isRequired,
      type: PropTypes.string.isRequired,
      uuid: PropTypes.string.isRequired,
    }),
  ).isRequired,
  getFavicon: PropTypes.func.isRequired,
};

export default function Listing({ latestArticles, getFavicon }) {
  const articles = latestArticles.map(article => {
    const favicon = getFavicon(article.type);
    return (
      <Article
        key={article.uuid}
        favicon={favicon}
        {...article}
      />
    );
  });
  return (
    <section className="listing">
      { articles }
    </section>
  );
}
