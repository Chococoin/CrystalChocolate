import React from 'react';
import Bankwheel from './Bankwheel';

const electron = window.require('electron')
const ipcRenderer  = electron.ipcRenderer

class DappApi extends React.Component {
  constructor(){
    super();
    this.state = {
      balance : ''
    }
  }

  componentDidMount(){
    ipcRenderer.on('infura', (event, res) =>{
      let balance = parseInt(res._hex, 16);
      this.setState({
        balance
      })
    })
  }

  render(){
    return(
      <React.Fragment>
        {this.state.balance === '' ? <Bankwheel /> : 'CTOK: ' + (this.state.balance) }
      </React.Fragment>
    )
  }
}

export default DappApi;
