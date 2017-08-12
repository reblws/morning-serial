// app/index.js
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import io from 'socket.io-client';
import { ChevronDown } from 'react-feather';
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
    this.shiftNewArticle = this.shiftNewArticle.bind(this);
  }

  componentDidMount() {
    const { activeFeeds } = this.state;
    socketClient.open(activeFeeds, this.shiftNewArticle);
  }

  componentWillUnmount() {
    socketClient.close();
  }

  shiftNewArticle(article) {
    const { latestArticles } = this.state;
    const newArticles = [article, ...latestArticles]
      .sort((a, b) => new Date(b) - new Date(a));
    this.setState({ latestArticles: newArticles });
  }

  toggleOptions() {
    this.setState({
      showOptions: !this.state.showOptions,
    });
  }

  toggleActiveFeed(event) {
    const { feed } = event.currentTarget.dataset;
    const { activeFeeds, latestArticles, increment } = this.state;
    // Compute page dynamically with length
    const newActiveFeeds = activeFeeds.includes(feed)
      ? activeFeeds.filter(x => x !== feed).filter(x => x)
      : [...activeFeeds, feed];
    // Need to make our api request here
    // TODO: handle when someone removes ALL feeds
    return apiClient.getNextPage(0, newActiveFeeds)
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
    const offset = activeFeeds % increment;
    return apiClient.getNextPage(nextPageVal, activeFeeds, increment, offset)
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

