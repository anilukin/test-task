'use client';

import React, { useState } from 'react';
import { Form, InputGroup, Button } from 'react-bootstrap';

export default function Home() {
  const [walletNumber, setWalletNumber] = useState('');

  const handleSubmit = (e: React.SubmitEvent) => {
    e.preventDefault();
    if (!walletNumber.trim()) {
      return;
    }
    //TODO: wallet connection
  };
  const handleClear = () => setWalletNumber('');
  return (
    <div className='container m-3'>
      <div className='row'>
        <Form onSubmit={handleSubmit} className='mb-4'>
          <InputGroup className='mb-3'>
            <Form.Control
              placeholder='Enter wallet number'
              aria-label='wallet number'
              aria-describedby='connectWallet'
              name='walletNumber'
              id='walletNumberField'
              type='text'
              autoComplete='off'
              value={walletNumber}
              onChange={(e) => setWalletNumber(e.target.value)}
            />
            {walletNumber && (
              <Button
                variant='outline-secondary-light'
                onClick={handleClear}
                type='button'
                className='border-0'
              >
                ✕
              </Button>
            )}
            <Button variant='primary' id='connectWallet'>
              Connect Wallet
            </Button>
          </InputGroup>
        </Form>
      </div>
    </div>
  );
}
