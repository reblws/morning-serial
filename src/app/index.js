// app/index.js
import React, { Component } from 'react';
import Listing from './components/Listing';
import Options from './components/Options';
import api from './api-client';

export default class App extends Component {
  constructor(props) {
    // Each key from the server ends up in props
    super(props);
    const { activeFeeds, latestArticles, availableSources } = this.props;
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
    const { latestArticles, availableSources, activeFeeds } = this.state;
    return (
      <div>
        <header>
          <h1>Hello world</h1>
        </header>
        <Options
          availableSources={availableSources}
          activeFeeds={activeFeeds}
          toggleActiveFeed={this.toggleActiveFeed}
        />
        <Listing latestArticles={latestArticles} />
      </div>
    );
  }
}
