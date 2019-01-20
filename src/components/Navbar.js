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
    this.closeListener = this.closeListener.bind(this)
  }

  signIn(e){
    e.preventDefault();
    if(this.state.isLoginClosed){
      ipcRenderer.send('signIn:open', this.state.isLoginClosed)
    } else {
      ipcRenderer.send('signIn:close', this.state.isLoginClosed)
    }
  }

  signUp(e){
    e.preventDefault();
    if(this.state.isRegisterClosed){
      ipcRenderer.send('signUp:open', this.state.isRegisterClosed)
    } else {
      ipcRenderer.send('signUp:close', this.state.isRegisterClosed)
    }
  }

  closeListener(data){
    this.setState(prevState => {
      if(data[0] === "isLoginClosed"){
        return prevState.isLoginClosed = data[1]
      }
      if(data[0] === "isRegisterClosed"){
        return prevState.isRegisterClosed = data[1]
      }
    })
  }

  componentDidMount(){
    ipcRenderer.on('send-to-renderer', (event, data) => this.closeListener(data))
  }

  componentWillUnmount(){
    ipcRenderer.removeListener('send-to-renderer', this.closeListener)
  }

  render(){
    return(
        <nav>
          <div className="nav-wrapper brown darken-3">
            <a className="logo"><img src="https://image.ibb.co/fm3oPf/logo.png" alt="logo" border="0"  style={{height: "75%", marginTop: "10px", marginLeft: "5px"}}/></a>
            <ul id="nav-mobile" className="right hide-on-med-and-down">
              <li style={!this.state.isLoginClosed ? {fontWeight : "bold"} : null}><a href="" id="log" onClick={this.signIn}>Login</a></li>
              <li style={!this.state.isRegisterClosed ? {fontWeight : "bold"} : null}><a href="" id="reg" onClick={this.signUp}>SignUp</a></li>
            </ul>
          </div>
        </nav>
    )
  }
}

export default Navbar
