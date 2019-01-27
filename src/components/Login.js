import React from 'react'
import '../../css/materialize.css'

class Login extends React.Component{
  state = {
    todo: ''
  }
  
  submitLogin = (e) => {
    e.preventDefault()
    ipcRenderer.send('user:add', {user, pass})
  }


  openSignUp = (e) => {
    e.preventDefault()
    ipcRenderer.send('signUp:open')
  }

  render() {
    return(
      <div>
        <h3 className="center">Login</h3>
          <div className="container">
            <div className="row">
              <div className="col s2"></div>
              <form className="col s8">
                <fieldset>
                  <legend>Login</legend>
                  <label for="username">User or e-mail</label>
                  <input type="text" name="username" id="user">
                  <label for="password">Password</label>
                  <input type="text" name="password" id="pass">
                  <button className="btn-small waves-effect waves-light col s3 offset-s9"
                        type="submit" onClick={submitLogin}>
                        Submit
                  </button>
                </fieldset>
              </form>
              <div className="col s2"></div>
            </div>
            <div className="row">
              <p className="col s6 offset-s4">
                Not registred yet? <a href="" id="link" onClick={openSignUp}>Sign Up</a>
              </p>
          </div>
      </div>
    )
  }

}

export default Login
