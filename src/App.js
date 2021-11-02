
import { ethers } from "ethers";
import { useState } from "react";
import Greeter from './artifacts/contracts/Greeter.sol/Greeter.json'
import "./styles.css";

const GREETER_ADDRESS = '0x5FbDB2315678afecb367f032d93F642f64180aa3'

export default function App() {
    const [greeting, setGreetingValue] = useState('');

    async function fetchGreeting() {
        if (typeof window.ethereum !== 'undefined') {
            const provider = new ethers.providers.Web3Provider(window.ethereum);
            const contract = new ethers.Contract(GREETER_ADDRESS, Greeter.abi, provider)
            try {
                const data = await contract.greet();
                console.log('data: ', data)
            } catch (err) {
                console.log('Error: ', err)
            }
        }
    }

    async function setGreeting() {
        if (!greeting) return
        if (typeof window.ethereum !== 'undefined') {
            await requestAccount()
            const provider = new ethers.providers.Web3Provider(window.ethereum);
            const signer = provider.getSigner()
            const contract = new ethers.Contract(GREETER_ADDRESS, Greeter.abi, signer)
            const transaction = await contract.setGreeting(greeting)
            await transaction.wait()
            setGreetingValue('')
            fetchGreeting()
        }
    }

    // connects to users metamask wallet
    async function requestAccount() {
        await window.ethereum.request({ method: 'eth_requestAccounts' })
    }

    return (
        <div className="App">
            <h1>Hello Solidity</h1>
            <h2>Start editing to see some magic happen!</h2>
            <main>
                <button onClick={fetchGreeting}>Fetch Greeting</button>
                <button onClick={setGreeting}>Set Greeting</button>
                <input onChange={e => setGreetingValue(e.target.value)} value={greeting} placeholder="Set Greeting" />
            </main>
        </div>
    );
}
