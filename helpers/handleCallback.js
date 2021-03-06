const apiRequests = require('superagent');
const githubKey = require('../keys/strategy-keys');
const User = require('../models/Users');

function handleCallback(url, req_status) {
    return new Promise(function(resolve, reject){
    var raw_code = /code=([^&]*)/.exec(url) || null;
    var raw_status_res = /status=([a-zA-Z0-9]*)/.exec(url) || null;
    var code = (raw_code && raw_code.length > 1) ? raw_code[1] : null;
    var status_res = ( raw_status_res && raw_status_res.length > 1) ? raw_status_res[1] : null;
    var error = /\?error=(.+)$/.exec(url);

    // Avoid a men-in-the-middle attack
    if (status_res != req_status && status_res != null){
      oauthWindow.destroy();
    }

    if (code || error) {
      // Close the browser if code found or error
      oauthWindow.destroy();
    }

    // If there is a code, proceed to get token from github
    if (code) {
      apiRequests
      .post('https://github.com/login/oauth/access_token', {
        client_id: githubKey.clientId,
        client_secret: githubKey.clientSecret,
        code: code,
        status: status_res
      })
      .end(function (err, response) {
        if (response && response.ok) {
          // Success - Received Token.
          // Store it in localStorage maybe?
          apiRequests.get('https://api.github.com/user', {
            access_token: response.body.access_token,
          }).end((err, res) => {
            User.findOne({ github_email: res.body.email }).then( resp => {
              if(resp === null){
                var newUser = new User({
                  user: res.body.login,
                  github_email: res.body.email,
                  avatar: res.body.avatar
                });
                newUser.save();
              } else {
                console.log('Welcome: ', resp.user);
                resolve(response.body.access_token);
              }
            })
          })
        } else {
          // Error - Show messages. TODO
          var error = new Error (err);
          reject(error);
        }
      });

    } else if (error) {
          // Error - Show messages. TODO
          var errors = new Error (error);
          reject(errors);
    }
  })
  }

  module.exports = handleCallback;
