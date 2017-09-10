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

  componentDidUpdate(_, prevState) {
    const { activeFeeds, increment } = this.state;

    const apiOptions = {
      sources: activeFeeds,
      increment,
    };

    // Since each feed change results in a new number, just compare length
    // to verify they're not equal
    const shouldRefreshArticles = prevState.activeFeeds.length !== activeFeeds.length;
    if (shouldRefreshArticles) {
      apiClient.getPage(0, apiOptions).then(latestArticles => {
        this.setState({ latestArticles });
      });
    }
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
    const { activeFeeds } = this.state;
    const isLeaving = activeFeeds.includes(feed);

    // Don't do anything if all feeds are about to be removed
    if (isLeaving && activeFeeds.length === 1) {
      return;
    }

    // Leave or join the feed's socket room tepending if were toggling off or
    // on
    if (isLeaving) {
      socketClient.leave(feed);
    } else {
      socketClient.join(feed);
    }

    // Only change the new feed array here, componentDidUpdate should handle
    // the API call for new articles
    this.setState((prevState) => {
      const nextActiveFeeds = isLeaving
        ? prevState.activeFeeds.filter(prevFeed => prevFeed !== feed)
        : [feed, ...prevState.activeFeeds];
      App.writeActiveFeedsCookie(nextActiveFeeds);
      return {
        activeFeeds: nextActiveFeeds,
      };
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
      <div id="root-component">
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
            <button
              className={optionsToggleButton.join(' ')}
              onClick={this.toggleOptions}
              aria-expanded={showOptions}
              aria-controls="options"
            >
              <strong>Options</strong>
            </button>
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
      </div>
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

