import React from 'react'
import M from '../../js/materialize.js'
import LikeButton from './like_button'

class Collapse extends React.Component{

  componentDidMount(){
    M.Collapsible.init(this.collapsible, {
      inDuration: 800,
      outDuration: 800
    })
  }

  render(){
    return(
      <ul className="collapsible" id="collaps" ref={(collapsible) =>  {this.collapsible = collapsible}}>
        <li>
          <div className="collapsible-header valign-wrapper" id="inicio">inicio</div>
          <div className="collapsible-body" id="start">
            <a className="waves-effect waves-light btn-large social github" id="ghb" onClick={undefined}>
            <i className="fa fa-github"></i> Sign in with github</a>
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
          <div className="collapsible-header valign-wrapper" id="banco">Banco</div>
          <div className="collapsible-body" id="banco-body">
            <h3 className="col s4 center"> EUR </h3>
            <p id="tag" className="col s4 center"><span>€ </span></p>
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
