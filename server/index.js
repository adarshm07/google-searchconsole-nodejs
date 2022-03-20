const express = require("express");
const app = express();
const cors = require("cors");
const bodyParser = require("body-parser");
require("./db.js");

// google console
const { google } = require("googleapis");
const { JWT } = require("google-auth-library");
const searchconsole = google.searchconsole("v1");
const keys = require("./keys.json");

app.use(bodyParser.urlencoded({ extended: false }));

function enableCors(expressInstance) {
  expressInstance.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header(
      "Access-Control-Allow-Headers",
      "Origin, X-Requested-With, Content-Type, Accept, Authorization, timeZone"
    );
    res.header(
      "Access-Control-Allow-Methods",
      "GET, POST, PUT, DELETE, OPTIONS, PATCH"
    );
    next();
  });
}
enableCors(app);

// create a middleware to check for authentication
function checkAuth(req, res, next) {
  try {
    const keys = require("./keys.json");
    const client = new JWT({
      email: keys.client_email,
      key: keys.private_key,
      scopes: [
        "https://www.googleapis.com/auth/webmasters",
        "https://www.googleapis.com/auth/webmasters.readonly",
      ],
    });
    google.options({ auth: client });
    console.log("Authenticated");
  } catch (err) {
    console.log("Not Authenticated");
  }
  next();
}

app.get("/api/site-list", checkAuth, async (req, res) => {
  const resSiteList = await searchconsole.sites.list({});
  res.send(resSiteList.data);
});

app.post("/api/submit-url-inspection", checkAuth, async (req, res) => {
  const { siteUrl, url } = req.body;
  const resSubmitUrlInspection = await searchconsole.urls.submit({
    siteUrl,
    url,
  });
  res.send(resSubmitUrlInspection.data);
});

app.post("/api/url-inspection", checkAuth, async (req, res) => {
  const { siteUrl, url, lang } = req.body;
  const resUrlInspection = await searchconsole.urlInspection.index.inspect({
    inspectionUrl: url,
    siteUrl,
    languageCode: lang,
  });
  res.send(resUrlInspection.data);
});

app.post("/api/url-inspection-list", checkAuth, async (req, res) => {
  const { endDate, startDate, filter, dimension, rowlimit, siteUrl } = req.body;
  const response = await searchconsole.searchanalytics.query({
    siteUrl,
    requestBody: {
      endDate,
      startDate,
      dimensions: [dimension],
      filters: filter,
      rowLimit: rowlimit,
    },
  });
  res.send(response.data);
});

app.listen(3001, () => {
  console.log("Server started on port 3001");
});
