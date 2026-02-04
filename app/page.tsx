'use client';

import { Button } from 'react-bootstrap';
import { useWallet } from './Hooks/useWallet';
import { AccountCard } from '@/app/Components/AccountCard';

export default function Home() {
  const { accountsInfo, error, isConnecting, connect, disconnect } =
    useWallet();

  return (
    <div className='container mt-5'>
      <div className='row mb-3 justify-content-center'>
        {accountsInfo.length === 0 ? (
          <Button
            className='col-md-6'
            variant='primary'
            id='connectWallet'
            type='button'
            onClick={connect}
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
            onClick={disconnect}
          >
            Disconnect Wallet
          </Button>
        )}
      </div>
      {accountsInfo.length > 0 && (
        <div className='row mb-3 justify-content-center'>
          {accountsInfo.map((account, idx) => (
            <AccountCard key={account.address} account={account} idx={idx} />
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
