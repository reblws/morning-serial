// app/index.js
import React, { Component } from 'react';

export default class App extends Component {
  render() {
    const { isMobile } = this.props;
    return (
      <div>
        <h1>hello world</h1>
        <p>{isMobile}</p>
      </div>
    );
  }
}
