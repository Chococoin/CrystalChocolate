import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';

class App extends Component {
  render() {
    return (
      <div className="App">
      </div>


  <script>
    const key = require('../keys/key');
    const secret = require('../keys/secret');
    const KrakenClient = require('../helpers/kraken');
    const thereIsaChocoCookie = require('../helpers/whereIsMyChocoCookie');
    const kraken = new KrakenClient(key, secret);
    const electron = require('electron');
    const {ipcRenderer} = electron;

    function krakenApiCall(){
      var message = "null";
      kraken.api('Balance')
        .then(res => {
          message = res.result.ZEUR;
          var tag = document.getElementById('tag');
          const itemMessage = document.createTextNode(message);
          tag.appendChild(itemMessage)})
        .catch(err => console.log(err));
    }

    krakenApiCall();

    var elem = document.querySelector('.collapsible');
    var instance = new M.Collapsible(elem, {
      inDuration: 800,
      outDuration: 800
    });

    let myChocoCookie = localStorage.getItem("choco-cookie");
    console.log(myChocoCookie);

    const log = document.getElementById('log');
    log.addEventListener('click', signIn);

    const register = document.getElementById('reg');
    register.addEventListener('click', signUp);

    const oauther = document.getElementById('ghb');
    oauther.addEventListener('click', oauthGithub);

    thereIsaChocoCookie();

    function signIn(e){
      e.preventDefault();
      ipcRenderer.send('signInMain:open');
    }

    function signUp(e){
      e.preventDefault();
      ipcRenderer.send('signUpMain:open');
    }

    ipcRenderer.on('cookie', (event, arg) => {
      localStorage.setItem("choco-cookie", arg);
    })

  </script>
  <script>
    const React = require('react');
    const ReactDOM = require('react-dom');
  </script>
  <script src="../js/babel.js"></script>
  <script type="text/babel" src="../components/like_button.js"></script>

      </div>
    );
  }
}

export default App;
