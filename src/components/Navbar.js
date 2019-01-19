import React from 'react'
import '../../css/materialize.css'

const electron = window.require('electron')
const ipcRenderer  = electron.ipcRenderer

class Navbar extends React.Component{
  constructor(){
    super()
    this.state = {
      isLoginClosed: true,
      isRegisterClosed: true
    }

    this.signIn = this.signIn.bind(this)
    this.signUp = this.signUp.bind(this)
  }

  signIn(e){
    e.preventDefault();
    if(this.state.isLoginClosed){
      ipcRenderer.send('signInMain:open')
      this.setState(prevState => prevState.isLoginClosed = !prevState.isLoginClosed)
      console.log(this.state.isLoginClosed) // TODO: Wire with main to change state
    }
  }

  signUp(e){
    e.preventDefault();
    if(this.state.isLoginClosed){
      ipcRenderer.send('signUpMain:open')
      this.setState(prevState => prevState.isRegisterClosed= !prevState.isRegisterClosed)
      console.log(this.state.isRegisterClosed) // TODO: Wire with main to change state
    }
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
