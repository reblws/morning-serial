![Morning Serial](https://user-images.githubusercontent.com/9971847/29468139-fe1f3e80-8410-11e7-9266-1d425d5ae9bd.png)
> a real-time news aggregator

Morning Serial provides a chronological view of the latest headlines from a variety of different (mostly tech-oriented) websites. Once the page is loaded, new headlines are inserted in the page as they come out in real-time, giving a fresh look at the latest news without any interaction by the user. It also includes a cryptocurrency ticker.

## Getting Started

These instructions will get you a copy of the server up and running on your local machine for development.

### Prerequisites

- [Node](https://nodejs.org/) >8.0.0
  - Check out [tj/n](https://github.com/tj/n) or [nvm](https://github.com/creationix/nvm) for node versioning
- [RethinkDB](https://www.rethinkdb.com/) >=2.3

I recommend using something like [direnv](https://direnv.net/) to manage project-specific environment variables.

The following envrionment variables need to be set (the values in [.envrc.example](.envrc.example) should be fine):

- **PORT**
  - Port you want the express server to listen on
- **RETHINKDB_PORT**
  - The client-driver connection port
- **RETHINKDB_HOST**
  - Where the RethinkDB instance is hosted
- **NODE_ENV**
  - development or production
- **HOST**
  - Hostname of the site, only matters if NODE_ENV=production

### Start

1. Make sure RethinkDB is alive before starting
    - `$ rethinkdb`
2. From the project folder, install the required dependencies
    - `$ npm install` or `$ yarn install`
3. Start the server
    - `$ npm run start` or `$ yarn start`
      - This starts nodemon and webpack in watch mode. The Javascript is automatically rebundled and the server restarted after each save.

There are two important scripts in the `scripts/` folder: `feed-worker.js` and `dl-favicons.js`. Run these in node to populate the database and download each source's favicons. The favicon script is also available as a script under package.json (`npm run favicons`).

### Deploy

`npm run build` or `yarn run build`

After running the `build` script, the `dist/` folder should be populated with a copy of the server and static assets.

Run the `feed-worker.js` script as a cronjob to continue populating the db with new articles. There's an example file that shows the syntax.

`dist/server.js` contains the code needed to run the Express server.

`dist/assets` contains all static assets needed for the front-end. Can host these files in a CDN, just make sure that `bundle.js` and `server.js` are built in sync to avoid any dissociations between client- and server-rendered markup.

## Contributing

Any and all PRs are welcome. Feel free to raise any issues as well.

If there's a cool site that you think the site is missing, adding it is easy if they have an ATOM/RSS feed. Just add the site in the `/src/data/types.js` file with the name of the site in CamelCase as the key and a dash-separated name as the value. Then add a new file in the `/src/data/sources` folder, and instantiate a new member of the Feed class ([example](/src/data/sources/ars-technica.js)).

Most of the front-end is built with React and is found in the [view](/src/view) folder. The CSS is built with PostCSS plugins (import, [cssnext](http://cssnext.io/), and [short](https://github.com/jonathantneal/postcss-short)), so use as many features from the latest CSS spec as you want.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details

## Acknowledgements

- [CryptoCurrency Market Capitalizations](https://coinmarketcap.com/) powers the cryptocurrency ticker
- [cryptocoins](https://github.com/allienworks/cryptocoins) free cryptocurrency SVGs
- [HK Grotesk](https://www.fontsquirrel.com/fonts/hk-grotesk) a free, good-looking grotesk
- [Zilla Slab](https://github.com/mozilla/zilla-slab) display font
