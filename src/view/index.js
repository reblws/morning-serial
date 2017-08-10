// app/index.js
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import CoinMarketTicker from './components/CoinMarketTicker';
import Listing from './components/Listing';
import Options from './components/Options';
import api from './api-client';

export default class App extends Component {
  // Make the api request for the next page
  static getNextPage(currentPage, activeFeeds) {
    const nextPage = currentPage + 1;
    return api.get('/feeds', {
      params: {
        sources: activeFeeds.join('+'),
        page: nextPage,
      },
    }).then(x => x.data);
  }

  constructor(props) {
    // Each key from the server ends up in props
    super(props);
    const {
      activeFeeds,
      latestArticles,
      availableSources,
    } = this.props;
    this.state = {
      activeFeeds,
      latestArticles,
      availableSources,
      page: 0,
    };
    this.toggleActiveFeed = this.toggleActiveFeed.bind(this);
    this.goNextPage = this.goNextPage.bind(this);
  }

  toggleActiveFeed(event) {
    const { feed } = event.target.dataset;
    const { activeFeeds } = this.state;
    const newActiveFeeds = activeFeeds.includes(feed)
      ? activeFeeds.filter(x => x !== feed)
      : [...activeFeeds, feed];
    // Need to make our api request here
    // TODO: handle when someone removes ALL feeds
    api.get('/feeds', {
      params: {
        sources: newActiveFeeds.join('+'),
      },
    })
      .then(response => {
        this.setState({
          activeFeeds: newActiveFeeds,
          latestArticles: response.data,
          page: 0,
        });
      });
  }

  goNextPage() {
    const {
      page,
      activeFeeds,
      latestArticles,
    } = this.state;
    const nextPageVal = page + 1;
    const nextArticles = App.getNextPage(nextPageVal, activeFeeds)
      .then(newArticles => {
        console.log(newArticles);
        this.setState({
          page: nextPageVal,
          latestArticles: [...latestArticles, ...newArticles],
        });
      });
  }

  render() {
    const {
      latestArticles,
      availableSources,
      activeFeeds,
    } = this.state;
    const getFavicon = type =>
      availableSources.filter(src => src.type === type)[0].faviconURL;
    return (
      <main>
        <Options
          availableSources={availableSources}
          activeFeeds={activeFeeds}
          toggleActiveFeed={this.toggleActiveFeed}
        />
        <header className="title">
          <h1>Morning <strong>Serial</strong></h1>
        </header>
        <CoinMarketTicker />
        <Listing
          latestArticles={latestArticles}
          getFavicon={getFavicon}
        />
        <center>
        <button onClick={this.goNextPage}>Next Page</button>
        </center>
      </main>
    );
  }
}

App.propTypes = {
  activeFeeds: PropTypes.arrayOf(PropTypes.string).isRequired,
  latestArticles: PropTypes.arrayOf(PropTypes.shape({
    link: PropTypes.string.isRequired,
    publishedAt: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    type: PropTypes.string.isRequired,
    uuid: PropTypes.string.isRequired,
  })).isRequired,
  availableSources: PropTypes.arrayOf(PropTypes.shape({
    name: PropTypes.string.isRequired,
    faviconURL: PropTypes.string.isRequired,
    host: PropTypes.string.isRequired,
    type: PropTypes.string.isRequired,
  })).isRequired,
};

