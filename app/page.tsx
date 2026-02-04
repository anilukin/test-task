'use client';

import { useState } from 'react';
import { Button, Card } from 'react-bootstrap';
import { ethers } from 'ethers';

export default function Home() {
  const [account, setAccount] = useState<string | null>(null);
  const [balance, setBalance] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);

  const handleClick = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setError(null);

    if (!window.ethereum?.isMetaMask) {
      setError('Please install the MetaMask extension.');
      return;
    }

    try {
      setIsConnecting(true);
      const provider = new ethers.BrowserProvider(window.ethereum);
      const accounts = await provider.send('eth_requestAccounts', []);
      const acc = accounts[0];
      setAccount(acc);

      const rawBalance = await provider.getBalance(acc);
      const eth = Number(ethers.formatEther(rawBalance)).toFixed(4);
      setBalance(eth);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to connect wallet. Please try again.';
      setError(errorMessage);
    } finally {
      setIsConnecting(false);
    }
  };

  const handleDisconnect = () => {
    setAccount(null);
    setBalance(null);
    setError(null);
  };

  return (
    <div className='container m-3'>
      <div className='row mb-3'>
        {!account ? (
          <Button
            variant='primary'
            id='connectWallet'
            type='button'
            onClick={handleClick}
            disabled={isConnecting}
          >
            {isConnecting ? 'Connecting...' : 'Connect Wallet'}
          </Button>
        ) : null}
      </div>
      {account && (
        <div className='row mb-3'>
          <Card>
            <Card.Body>
              <Card.Title>
                Wallet: <br />
                {account}
              </Card.Title>
              <Card.Text>Balance: {balance} ETH</Card.Text>
              <Button
                variant='info'
                id='disconnectWallet'
                type='button'
                onClick={handleDisconnect}
              >
                Disconnect Wallet
              </Button>
            </Card.Body>
          </Card>
        </div>
      )}
      {error && (
        <div className='alert alert-danger'>
          <strong>Error!</strong>
          <br />
          {error}
        </div>
      )}
    </div>
  );
}
