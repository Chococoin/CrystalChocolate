import React from 'react'
import '../../css/materialize.css'

function Navbar(){
    return(
        <nav>
          <div className="nav-wrapper brown darken-3">
            <a className="logo"><img src="https://image.ibb.co/fm3oPf/logo.png" alt="logo" border="0"  style={{height: "75%", marginTop: "10px", marginLeft: "5px"}}/></a>
            <ul id="nav-mobile" className="right hide-on-med-and-down">
              <li><a href="" id="log" onclick="signIn()">Login</a></li>
              <li><a href="" id="reg" onclick="signUp()">SignUp</a></li>
            </ul>
          </div>
        </nav>
    )
}

export default Navbar