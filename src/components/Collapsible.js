import React from 'react'
import M from '../../js/materialize.js'
import LikeButton from './like_button'

const electron = window.require('electron')
const ipcRenderer  = electron.ipcRenderer

const visible = {
  display: 'inline-block'
}

const invisible = {
  display: 'none'
}

class Collapse extends React.Component{
  constructor(){
    super()
    this.state = {
      cookie : '',
      githubBar: visible,
      urlImg: '',
      founds: ''
    }
    this.oauthGithub = this.oauthGithub.bind(this)
    this.krakenRequest = this.krakenRequest.bind(this)
  }

  componentDidMount(){
    M.Collapsible.init(this.collapsible, {
      inDuration: 800,
      outDuration: 800
    })
    
    ipcRenderer.on('cookie', (event, myChocoCookie) => {
      this.setState({
        cookie: myChocoCookie
      })
      fetch(`https://api.github.com/user?access_token=${myChocoCookie}`)
      .then(response => {
        return response.json();
      }).then(resp => {
        this.setState({
          urlImg: resp.avatar_url,
          githubBar: invisible,
          altImg: "Github Avatar"
        })
      }).catch(error => console.log(error))
    })

    ipcRenderer.on('kraken', (event, amount) =>{
      this.setState({
        founds: amount
      })
    })
  }

  krakenRequest(e){
    e.preventDefault();
    ipcRenderer.send('bank:request');
  }

  oauthGithub(e){
    e.preventDefault();
    ipcRenderer.send('OAuthGithub:open');
  }

  render(){
    return(
      <ul className="collapsible" id="collaps" ref={(collapsible) =>  {this.collapsible = collapsible}}>
        <li>
          <div className="collapsible-header valign-wrapper" id="inicio">inicio</div>
          <div className="collapsible-body">
            <a className="waves-effect waves-light btn-large social github" id="ghb" style={this.state.githubBar} onClick={this.oauthGithub}>
            <i className="fa fa-github"></i> Sign in with github</a>
            {this.state.githubBar !== "visible" && <img alt={this.state.altImg} src={this.state.urlImg} style={{width: 150, heigth: 150}} />}
          </div>
        </li>
        <li>
          <div className="collapsible-header valign-wrapper" id="que">¿Qué es la chocosfera?</div>
          <div className="collapsible-body"><LikeButton /></div>
        </li>
        <li>
          <div className="collapsible-header valign-wrapper" id="historia">historia</div>
          <div className="collapsible-body valign-wrapper"><span>Lorem ipsum dolor sit amet.</span></div>
        </li>
        <li>
          <div className="collapsible-header valign-wrapper" id="fabrica">Choco Fábrica</div>
          <div className="collapsible-body valign-wrapper"><span>Lorem ipsum dolor sit amet.</span></div>
        </li>
        <li>
          <div className="collapsible-header valign-wrapper" onClick={this.krakenRequest} id="banco">Banco</div>
          <div className="collapsible-body" id="banco-body">
            <h3 className="col s4 center"> EUR </h3>
            <p className="col s4 center"> {this.state.founds === '' ? 'Loading ...' : (this.state.founds )}</p>
          </div>
        </li>
        <li>
          <div className="collapsible-header valign-wrapper" id="soporte">Soporte</div>
          <div className="collapsible-body"><span>Lorem ipsum dolor sit amet.</span></div>
        </li>
      </ul>
    )
  }
}

export default Collapse
