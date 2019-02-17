import React from 'react'
import Web3 from 'web3'
import TruffleContract from 'truffle-contract'
import ChocoTokens from '../../contract/ChocoToken.json'
import HDWalletProvider from 'truffle-hdwallet-provider'
import Wallet from '../../contract/wallet/wallet.json'

class ContractUI extends React.Component {
  render(){
    constructor(){
      super()
    
    this.state = {
      tokens: 30000,
      account: '' 
    }

    this.MyWallet = new HDWalletProvider(
      Wallet.MNEMONIC,
      `https://rinkeby.infura.io/v3/${Wallet.INFURA_API_KEY}`
    )

    this.contract = TruffleContract(Chocotokens)
    
    this.web3Provider = new Web3.providers.HttpProvider(this.MyWallet)
    this.web3 = new Web3(this.web3Provider)
    
    this.contract.setProvider(this.web3Provider)

  }

  componentDidMount() {
    this.web3.eth.getCoinbase((err, account) => {
      this.setState({account});
    })
  }
    return(
      <React.Fragment>
        <p>My Chocotokens: {this.state.tokens}</p>
        <p>My Account: {this.state.account} </p>
      </React.Fragment>
    )
  }
}

export default ContractUI
