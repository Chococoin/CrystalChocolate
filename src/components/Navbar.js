import React from 'react'
import '../../css/materialize.css'

const electron = window.require('electron')
const ipcRenderer  = electron.ipcRenderer

class Navbar extends React.Component{
  signIn(e){
    e.preventDefault();
    ipcRenderer.send('signInMain:open')
  }

  signUp(e){
    e.preventDefault();
    ipcRenderer.send('signUpMain:open')
  }

  render(){
    return(
        <nav>
          <div className="nav-wrapper brown darken-3">
            <a className="logo"><img src="https://image.ibb.co/fm3oPf/logo.png" alt="logo" border="0"  style={{height: "75%", marginTop: "10px", marginLeft: "5px"}}/></a>
            <ul id="nav-mobile" className="right hide-on-med-and-down">
              <li><a href="" id="log" onClick={this.signIn}>Login</a></li>
              <li><a href="" id="reg" onClick={this.signUp}>SignUp</a></li>
            </ul>
          </div>
        </nav>
    )
  }
}

export default Navbar
