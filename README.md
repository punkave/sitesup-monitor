# sitesup-monitor

`sitesup-monitor` generates a simple `sitesup.html` page based on an RSS feed from the `aremysitesup.com` service. Its value is in customizing the display via `views/index.html`, prioritizing sites that are down, and not requiring you to log in on that SmartTV you want to display it on.

The URL of the feed should live in an `options.js` file that you create. It looks like this:

```javascript
module.exports = {
  feed: 'http://aremysitesup.com/feednow/yourfeedurlnotminebuddy'
};
```

## Installation

Run `npm install` and create your `options.js` file as described above.

## Updating the Page

Run `node app`. This updates `sitesup.html`.

## Refreshing the Display

The page reloads itself every 30 seconds. *You should set up a cron job* to run the app once a minute so there is new data to display:

```javascript
# Cron job that runs once every minute
* * * * * (cd /path/to/sitesup-monitor && node app)
```

## Serving the Page

Just symlink it into your nginx document root folder or somethin'. You don't need an Express server to serve up this simple static page.

