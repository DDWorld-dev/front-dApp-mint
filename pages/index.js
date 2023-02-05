import React, { Component } from 'react'
import { ethers } from 'ethers'
import styles from '../styles/Home.module.css'
import { ConnectWallet } from '../components/ConnectWallet'
import LockAddress from '../contracts/Lock-contract-address.json'
import LockArtifact from '../contracts/Lock.json'
import { CheckAddress } from '../components/CheckAddress'
import { Mint } from '../components/Mint'
import { MakeOwner } from '../components/MakeOwner'
const HARDHAT_NETWORK_ID = '1337'

export default class Game extends Component {       

    constructor(props) {
  
      super(props)
      this.textInput = React.createRef();

      this.initialState = {
        selectedAccount: null,
        networkError: null,
        balance: null,
        checkAddress: null,
        boughtPass: null,
        messageError: null
      }
     

      this.state = this.initialState
      
    }
    
  
    _connectWallet = async () => {

      if(window.ethereum === undefined) {
        this.setState({
          networkError: 'Please install Metamask!'
        })
        return
      }
  
      const [selectedAddress] = await window.ethereum.request({
        method: 'eth_requestAccounts'
      })
      
      if(!this._checkNetwork()) { return }
  
      this._initialize(selectedAddress)
  
      window.ethereum.on('accountsChanged', ([newAddress]) => {
        if(newAddress === undefined) {
          return this._resetState()
        }
  
        this._initialize(newAddress)
      })
  
      window.ethereum.on('chainChanged', ([networkId]) => {
        this._resetState()
      })
    
     
      
    }
    _checkNetwork() {
      if (window.ethereum.networkVersion === HARDHAT_NETWORK_ID) { return true }
  
      this.setState({
        networkError: 'Please connect to localhost:8545'
      })
  
      return false
    } 

    async _initialize(selectedAddress) {
      
      this._provider = new ethers.providers.Web3Provider(window.ethereum)
  
      this.Lock = new ethers.Contract(
        LockAddress.Lock,
        LockArtifact.abi,
        this._provider.getSigner(0)
      )
      let addrBought = await this.Lock.amount(selectedAddress)
      
      this.setState({
        selectedAccount: selectedAddress,
        checkAddress: null,
        boughtPass: Number(addrBought)
      }, async () => 
        await this.updateBalance()
    ) 
   
   
  
    }
   
    async updateBalance() {
      const newBalance = (await this._provider.getBalance(
        this.state.selectedAccount
      )).toString()
  
      this.setState({
        balance: newBalance
      })
    }
  

    _resetState() {
      this.setState(this.initialState)
    }
  
    
    _dismissNetworkError = () => {
      this.setState({
        networkError: null
      })
    }
  
   
    _checkAddress = async() =>{
      try{
        const tx = await this.Lock.getAddress()
        console.log(tx);
        let currentAccaunt = ""
        let currentAccaunt1 = ""
          
        for(let i = 0; i <= this.state.selectedAccount.length-1; i++){

          if(i <= 10 ){
              currentAccaunt = currentAccaunt + this.state.selectedAccount[i]
          }

          if(i > this.state.selectedAccount.length - 5 && i > this.state.selectedAccount.length - 9){
            currentAccaunt1 = currentAccaunt1 + this.state.selectedAccount[i]
          }
          }
        let Account = currentAccaunt + "..." + currentAccaunt1
        this.setState({
          checkAddress: Account
        })
      }catch{
       
        this.setState({
          checkAddress: "not an owner!"
        })
      }
      
    }
  _mint = async() =>{  
      const tx = await this.Lock.mint({
        value: "5000"
      })
      await tx.wait()
      let addrBought = Number(await this.Lock.amount(this.state.selectedAccount))
      this.setState({
        boughtPass: addrBought
      })
      await this.updateBalance()
  }
  _makeOwner = async() =>{
    try{
      let tx = await this.Lock.makeOwner()
      this.setState({
        messageError: null
      })
      await this.updateBalance()
    }catch{
  
      this.setState({
        messageError: "Now you can't stay owner"
      })
    }
   
 
  }
  render() {
    if(!this.state.selectedAccount) {
     
      return <>
       
          <div>
            <ConnectWallet  connectWallet={this._connectWallet} networkError={this.state.networkError} dismiss={this._dismissNetworkError}/>
          </div >
         
          
        </> 
      }
    return(
      
      <>
      {this.state.balance &&  
       <p className={styles.balance}>balance: {ethers.utils.formatEther(this.state.balance).slice(0,10)} ETH</p>}

       <div>
       <CheckAddress funcAddress={this._checkAddress} checkAddr = {this.state.checkAddress}/>
       </div>
        <div>
          <Mint mintFunc= {this._mint} passId = {this.state.boughtPass}/>
        </div>
        <div>
          <MakeOwner funcMakeOwn={this._makeOwner} ErrMsg = {this.state.messageError} />
        </div>
        </> 

    )
        
       
      
    }
  } 


