// app/index.js
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import io from 'socket.io-client';
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
      page: 0,
      showOptions: false,
    };
    this.toggleActiveFeed = this.toggleActiveFeed.bind(this);
    this.toggleOptions = this.toggleOptions.bind(this);
    this.goNextPage = this.goNextPage.bind(this);
  }

  componentDidMount() {
    const socket = io('localhost:9000');
    const { activeFeeds } = this.state;
    // Messages are split up into rooms
    socket.emit('i want to join', activeFeeds);
    // Finish this and update feed
    socket.on('new article', msg => console.log(msg));
  }

  toggleOptions() {
    this.setState({
      showOptions: !this.state.showOptions,
    });
  }

  toggleActiveFeed(event) {
    const { feed } = event.currentTarget.dataset;
    const { activeFeeds } = this.state;
    const newActiveFeeds = activeFeeds.includes(feed)
      ? activeFeeds.filter(x => x !== feed).filter(x => x)
      : [...activeFeeds, feed];
    // Need to make our api request here
    // TODO: handle when someone removes ALL feeds
    return api.get('/feeds', {
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
        App.writeActiveFeedsCookie(newActiveFeeds);
      });
  }

  goNextPage() {
    const {
      page,
      activeFeeds,
      latestArticles,
    } = this.state;
    const nextPageVal = page + 1;
    return App.getNextPage(nextPageVal, activeFeeds)
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

    const commonButtonClasses = ['options__toggle', 'button-nostyle'];
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
            <button className="button-nostyle" onClick={this.goNextPage}>
              More
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

