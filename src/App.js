import React from 'react'
import Navbar from './components/Navbar'
import Logo from './components/Logo'
import Collapse from './components/Collapsible'
import '../css/materialize.css'
import '../css/materialize-social.css'
import "../css/fontAwesome.css"

function App(){
  return(
    <div>
      <Navbar />
      <Logo />
      <Collapse />
    </div>
  )
}

export default App