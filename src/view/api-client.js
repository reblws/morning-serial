import axios from 'axios';
import { host } from '../config/view';

class APIClient {
  constructor() {
    const baseURL = host === 'localhost'
      ? `${host}/api`
      : `https://${host}/api`;
    this.axios = axios.create({
      baseURL,
      timeout: 10000,
    });
  }

  fetch(endpoint, config = {}) {
    return this.axios.get(endpoint, config).then(x => x.data);
  }

  getPage(page, sources, increment = 25, offset = 0) {
    return this.fetch('/feeds', {
      params: {
        sources: Array.isArray(sources) ? sources.join('+') : sources,
        page,
        increment,
        offset,
      },
    });
  }
}

export default new APIClient();
