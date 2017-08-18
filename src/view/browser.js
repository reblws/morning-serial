// app/browser.js

import React, { Component } from 'react';
import { render } from 'react-dom';
import Moment from 'react-moment';
import App from './index';

Moment.startPooledTimer();

render(<App {...window.__APP_INITIAL_STATE__}/>, document.getElementById('root'));
