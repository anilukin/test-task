'use client';

import { useState } from 'react';
import { Button, Card } from 'react-bootstrap';
import { ethers } from 'ethers';

interface AccountInfo {
  address: string;
  ethBalance: string;
  usdtBalance: string;
}

const USDT_ADDRESS = '0xdAC17F958D2ee523a2206206994597C13D831ec7';
const USDT_ABI = [
  'function balanceOf(address owner) view returns (uint256)',
  'function decimals() view returns (uint8)',
];

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
          const ethBalance = Number(ethers.formatEther(rawBalance)).toFixed(4);

          const usdtContract = new ethers.Contract(
            USDT_ADDRESS,
            USDT_ABI,
            provider,
          );

          const rawUsdtBalance = await usdtContract.balanceOf(address);
          const usdtBalance = Number(
            ethers.formatUnits(rawUsdtBalance, 6),
          ).toFixed(2);
          return { address, ethBalance, usdtBalance };
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
      <div className='row mb-3 justify-content-center'>
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
        <div className='row mb-3 justify-content-center'>
          {accountsInfo.map((account, idx) => (
            <Card key={account.address} className='col-md-6 m-1'>
              <Card.Body>
                <Card.Header className='bg-transparent'>
                  <strong>Account {idx + 1}:</strong>
                  <br />
                  {account.address}
                </Card.Header>
                <div className='d-flex align-items-center gap-3 p-3'>
                  <Card.Text className='m-0 fw-bold'>Balance:</Card.Text>
                  <div className='d-flex flex-column gap-1'>
                    <Card.Text className='m-0'>
                      {account.ethBalance} ETH
                    </Card.Text>
                    <Card.Text className='m-0'>
                      {account.usdtBalance} USDT
                    </Card.Text>
                  </div>
                </div>
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
