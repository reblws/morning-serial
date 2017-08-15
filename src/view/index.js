// app/index.js
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import io from 'socket.io-client';
import { ChevronDown } from 'react-feather';
import moment from 'moment';
import CoinMarketTicker from './components/CoinMarketTicker';
import Listing from './components/Listing';
import Options from './components/Options';
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
      .sort((a, b) => moment.utc(a).diff(moment.utc(b)));
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

    // Compute page dynamically with length
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
    apiClient.getPage(0, newActiveFeeds)
      .then(latestArticles => {
        this.setState({
          activeFeeds: newActiveFeeds,
          latestArticles,
        });
        App.writeActiveFeedsCookie(newActiveFeeds);
      });
  }

  goNextPage() {
    const {
      activeFeeds,
      latestArticles,
      increment,
    } = this.state;
    const nextPageVal = App.calculatePage(latestArticles.length, increment) + 1;
    const offset = activeFeeds.length % increment;
    return apiClient.getPage(nextPageVal, activeFeeds, increment, offset)
      .then(newArticles => {
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
      showOptions,
    } = this.state;
    const getFavicon = type =>
      availableSources.filter(src => src.type === type)[0].faviconURL;

    const commonButtonClasses = ['options__toggle-button', 'button--nostyle'];
    const optionsButtonClassList = showOptions
      ? commonButtonClasses.concat('options__toggle--active')
      : commonButtonClasses.concat('options__toggle--inactive');
    return (
      <div>
        <main>
          <header className="title">
            <Options
              availableSources={availableSources}
              activeFeeds={activeFeeds}
              toggleActiveFeed={this.toggleActiveFeed}
              showOptions={showOptions}
            />
            <h1 className="title__header">
              Morning <b>Serial</b>
            </h1>
            <div className="title__button-container">
              <button className={optionsButtonClassList.join(' ')} onClick={this.toggleOptions}>Options</button>
            </div>
          </header>
          <CoinMarketTicker />
          <Listing
            latestArticles={latestArticles}
            getFavicon={getFavicon}
          />
          <div className="show-more">
            <button className="button--nostyle" onClick={this.goNextPage}>
              More
              <br />
              <ChevronDown />
            </button>
          </div>
        </main>
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

