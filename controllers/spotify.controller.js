const ErrorResponse = require("../utils/errorResponse");
var SpotifyWebApi = require("spotify-web-api-node");

const scopes = [
  "ugc-image-upload",
  "user-read-playback-state",
  "user-modify-playback-state",
  "user-read-currently-playing",
  "streaming",
  "app-remote-control",
  "user-read-email",
  "user-read-private",
  "playlist-read-collaborative",
  "playlist-modify-public",
  "playlist-read-private",
  "playlist-modify-private",
  "user-library-modify",
  "user-library-read",
  "user-top-read",
  "user-read-playback-position",
  "user-read-recently-played",
  "user-follow-read",
  "user-follow-modify",
];

var spotifyApi = new SpotifyWebApi({
  clientId: process.env.CLIENT_ID,
  clientSecret: process.env.CLIENT_SECRET,
  redirectUri: process.env.REDIRECT_URL,
});

exports.test = function (res, next) {
  try {
    res.status(200).json({
      data: "hi",
    });
  } catch (err) {
    next(err);
  }
};

exports.login = function (res, next) {
  try {
    res.status(200).json(spotifyApi.createAuthorizeURL(scopes));
  } catch (err) {
    next(err);
  }
};

exports.callback = function (req, res, next) {
  const error = req.query.error;
  const code = req.query.code;
  const state = req.query.state;

  if (error) {
    return next(new ErrorResponse(`Callback Error: ${error}`, 500));
  }

  spotifyApi
    .authorizationCodeGrant(code)
    .then((data) => {
      const access_token = data.body["access_token"];
      const refresh_token = data.body["refresh_token"];
      const expires_in = data.body["expires_in"];

      spotifyApi.setAccessToken(access_token);
      spotifyApi.setRefreshToken(refresh_token);

      console.log("access_token:", access_token);
      console.log("refresh_token:", refresh_token);

      console.log(
        `Sucessfully retreived access token. Expires in ${expires_in} s.`
      );
      res.send("Success! You can now close the window.");

      setInterval(async () => {
        const data = await spotifyApi.refreshAccessToken();
        const access_token = data.body["access_token"];

        console.log("The access token has been refreshed!");
        console.log("access_token:", access_token);
        spotifyApi.setAccessToken(access_token);
      }, (expires_in / 2) * 1000);
    })
    .catch((error) => {
      return next(new ErrorResponse(`Error in getting Tokens: ${error}`, 500));
    });
};

exports.isAuthorised = async function (req, res, next) {
  const token =
    "BQBygywGfgTvhiW5BUECdhhafpEXHf-3Ywqs4n20RVRhqgPbCrK9rQeeOsnN55-y0ceKLiTlQ4O4HjIVZeeEHEAWIwNXYq0smz7KkoCeh2ISbmnDkmcPr0VdxVyx4OhQrKCP7ksqJCkomZBPwIvd4r5PFTNb76gZPvnaeu8MJfAvJOW1-dbj-XC-025FPo-zl2eJqlEt93mIUO4R9yNcc0EBX3RCZFTLGMJlgbG_KomocE2fBnuF3eiQEWdMVVbgJey5MQJwTg0gGJYHs3zqu2Pt8skjflDBtMPPwFe63dm4jrFG-dHe";
  spotifyApi.setAccessToken(token);
  const data = await spotifyApi.getMe();
  try {
    res.status(200).json({
      data,
    });
  } catch (err) {
    next(err);
  }
};
