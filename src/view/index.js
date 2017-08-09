// app/index.js
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import CoinMarket from './components/CoinMarket';
import Listing from './components/Listing';
import Options from './components/Options';
import api from './api-client';

export default class App extends Component {
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
    };
    this.toggleActiveFeed = this.toggleActiveFeed.bind(this);
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
        <div className="content">
          <Options
            availableSources={availableSources}
            activeFeeds={activeFeeds}
            toggleActiveFeed={this.toggleActiveFeed}
          />
          <CoinMarket />
          <Listing
            latestArticles={latestArticles}
            getFavicon={getFavicon}
          />
        </div>
      </main>
    );
  }
}

App.propTypes = {
  activeFeeds: PropTypes.arrayOf(PropTypes.string).isRequired,
  latestArticles: PropTypes.arrayOf(PropTypes.shape({
    link: PropTypes.string.isRequired,
    publishedAt: PropTypes.instanceOf(Date).isRequired,
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

