import React from 'react';
import Article from './Article';


export default function Listing({ latestArticles }) {
  const articles = latestArticles.map(article =>
    <Article key={article.uuid} {...article} />
  );
  return (
    <section>
      { articles }
    </section>
  );
}
