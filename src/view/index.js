// app/index.js
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';

import CoinMarketTicker from './components/CoinMarketTicker';
import Listing from './components/Listing';
import Options from './components/Options';
import LoadingButton from './components/LoadingButton';

import socketClient from './socket-client';
import apiClient from './api-client';

export default class App extends Component {
  static calculatePage(articlesLoaded, increment) {
    return parseInt(articlesLoaded / increment, 10) - 1;
  }
  // Make the api request for the next page
  static writeActiveFeedsCookie(activeFeeds) {
    // Store active feeds as cookie to keep the same feeds
    // list on future visits
    document.cookie = `activeFeeds=${activeFeeds.join('+')}`;
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
      showOptions: false,
      isLoadingMoreArticles: false,
      increment: 25,
    };
    this.toggleActiveFeed = this.toggleActiveFeed.bind(this);
    this.toggleOptions = this.toggleOptions.bind(this);
    this.goNextPage = this.goNextPage.bind(this);
    this.addNewArticle = this.addNewArticle.bind(this);
  }

  componentDidMount() {
    const { activeFeeds } = this.state;
    socketClient.open(activeFeeds, this.addNewArticle);
  }

  componentWillUnmount() {
    socketClient.close();
  }

  addNewArticle(article) {
    const { latestArticles } = this.state;
    const newArticles = [article, ...latestArticles]
      .sort((a, b) =>
        moment.utc(b.publishedAt).diff(moment.utc(a.publishedAt))
      );
    this.setState({ latestArticles: newArticles });
  }

  toggleOptions() {
    this.setState({
      showOptions: !this.state.showOptions,
    });
  }

  toggleActiveFeed(event) {
    const { feed } = event.currentTarget.dataset;
    const { activeFeeds, increment } = this.state;
    const isLeaving = activeFeeds.includes(feed);

    // Don't do anything if all feeds are about to be removed
    if (isLeaving && activeFeeds.length === 1) {
      return;
    }

    // Compute current page dynamically with length
    const newActiveFeeds = isLeaving
      ? activeFeeds.filter(x => x !== feed).filter(x => x)
      : [...activeFeeds, feed];

    // Leave or join the feed's socket room tepending if were toggling off or
    // on
    if (isLeaving) {
      socketClient.leave(feed);
    } else {
      socketClient.join(feed);
    }

    // State
    const apiOptions = {
      sources: newActiveFeeds,
      increment,
    };

    apiClient.getPage(0, apiOptions)
      .then(latestArticles => {
        this.setState({
          activeFeeds: newActiveFeeds,
          latestArticles,
        });
        App.writeActiveFeedsCookie(newActiveFeeds);
      });
  }

  goNextPage() {
    this.setState({
      isLoadingMoreArticles: true,
    });
    const {
      activeFeeds,
      latestArticles,
      increment,
    } = this.state;
    const nextPageVal = App.calculatePage(latestArticles.length, increment) + 1;
    const offset = activeFeeds.length % increment;
    return apiClient.getPage(
      nextPageVal,
      {
        sources: activeFeeds,
        increment,
        offset,
      },
    )
      .then(newArticles => {
        this.setState({
          page: nextPageVal,
          latestArticles: [...latestArticles, ...newArticles],
          isLoadingMoreArticles: false,
        });
      });
  }

  render() {
    const {
      latestArticles,
      availableSources,
      activeFeeds,
      showOptions,
      isLoadingMoreArticles,
    } = this.state;

    const getFavicon = type => `/assets/favicons/${type}.png`;

    const commonButtonClassList = ['options__toggle-button', 'button--nostyle'];
    const optionsToggleButton = showOptions
      ? commonButtonClassList.concat('options__toggle--active')
      : commonButtonClassList.concat('options__toggle--inactive');
    const titleInfoBar = showOptions
      ? 'title__info-bar'
      : 'title__info-bar title__info-bar--hidden';
    return (
      <main>
        <header className="title" role="banner">
          <Options
            activeFeeds={activeFeeds}
            availableSources={availableSources}
            showOptions={showOptions}
            getFavicon={getFavicon}
            toggleActiveFeed={this.toggleActiveFeed}
          />
          <div className={titleInfoBar}>
            <a className="title__gh-icon" href="https://github.com/reblws/morning-serial">
              <img className="title__gh-icon--icon"src="/assets/gh.png" alt="GitHub" />
            </a>
          </div>
          <h1 className="title__header">
            Morning <b>Serial</b>
          </h1>
          <div className="title__button-container">
            <button className={optionsToggleButton.join(' ')} onClick={this.toggleOptions}><strong>Options</strong></button>
          </div>
        </header>
        <CoinMarketTicker />
        <Listing
          latestArticles={latestArticles}
          getFavicon={getFavicon}
        />
        <LoadingButton
          isLoading={isLoadingMoreArticles}
          goNextPage={this.goNextPage}
        />
      </main>
    );
  }
}

App.propTypes = {
  activeFeeds: PropTypes.arrayOf(PropTypes.string).isRequired,
  latestArticles: PropTypes.arrayOf(PropTypes.shape({
    link: PropTypes.string.isRequired,
    publishedAt: PropTypes.oneOfType([
      PropTypes.instanceOf(Date),
      PropTypes.string,
    ]),
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

