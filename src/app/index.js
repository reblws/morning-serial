// app/index.js
import React, { Component } from 'react';

export default class App extends Component {
  constructor(props) {
    // Each key from the server ends up in props
    super(props);
    this.state = { fetched: this.props.fetched };
  }
  render() {
    const { fetched } = this.state;
    return (
      <div>
        <h1>hello world</h1>
        <p>{String(fetched)}</p>
      </div>
    );
  }
}
