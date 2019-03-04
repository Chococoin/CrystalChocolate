const HDWalletProvider = require('truffle-hdwallet-provider');

const mnemonic = 'sniff inspire glide artwork dove share plate observe believe suspect season eager';

module.exports = {
  networks: {
    development: {
     host: "127.0.0.1",     // Localhost (default: none)
     port: 7545,            // Standard Ethereum port (default: none)
     network_id: "5777",       // Any network (default: none)
    },
    ropsten: {
      provider: () => new HDWalletProvider(mnemonic, 'https://ropsten.infura.io/v3/13eb2f7a24d048379237d1a85912203c'),
      network_id: 3,       // Ropsten's id
      gas: 5500000,        // Ropsten has a lower block limit than mainnet
    }
  }
}