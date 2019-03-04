import React from 'react';

// const electron = window.require('electron')
// const ipcRenderer  = electron.ipcRenderer

class DappApi extends React.Component {
  constructor(){
    super();
    this.state = {
      message : 'hola'
    }
  }

  render(){
    return(
      <div>
        {this.state.message}
      </div>
    )
  }
}

export default DappApi;
