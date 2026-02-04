'use client';

import { useState } from 'react';
import { Button, Card } from 'react-bootstrap';
import { ethers } from 'ethers';

interface AccountInfo {
  address: string;
  balance: string;
}

export default function Home() {
  const [accountsInfo, setAccountsInfo] = useState<AccountInfo[]>([]);
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
      const accounts: string[] = await provider.send('eth_requestAccounts', []);

      const accountsWithBalances: AccountInfo[] = await Promise.all(
        accounts.map(async (address: string) => {
          const rawBalance = await provider.getBalance(address);
          const balance = Number(ethers.formatEther(rawBalance)).toFixed(4);
          return { address, balance };
        }),
      );
      setAccountsInfo(accountsWithBalances);
    } catch (err) {
      const errorMessage =
        err instanceof Error
          ? err.message
          : 'Failed to connect wallet. Please try again.';
      setError(errorMessage);
    } finally {
      setIsConnecting(false);
    }
  };

  const handleDisconnect = () => {
    setAccountsInfo([]);
    setError(null);
  };

  return (
    <div className='container m-3'>
      <div className='row mb-3 justify-content-md-center'>
        {accountsInfo.length === 0 ? (
          <Button
            className='col-md-6'
            variant='primary'
            id='connectWallet'
            type='button'
            onClick={handleClick}
            disabled={isConnecting}
          >
            {isConnecting ? 'Connecting...' : 'Connect Wallet'}
          </Button>
        ) : (
          <Button
            className='col-md-6'
            variant='info'
            id='disconnectWallet'
            type='button'
            onClick={handleDisconnect}
          >
            Disconnect Wallet
          </Button>
        )}
      </div>
      {accountsInfo.length > 0 && (
        <div className='row mb-3 justify-content-md-center'>
          {accountsInfo.map((account, idx) => (
            <Card key={account.address} className='col-md-6 m-1'>
              <Card.Body>
                <Card.Title>
                  Account {idx + 1}: <br />
                  {account.address}
                </Card.Title>
                <Card.Text>Balance: {account.balance} ETH</Card.Text>
              </Card.Body>
            </Card>
          ))}
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
