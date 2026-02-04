import { useState } from 'react';
import { ethers } from 'ethers';
import { USDT_ADDRESS, USDT_ABI } from '@/app/constants/contracts';
import type { AccountInfo } from '@/app/types/types';

export function useWallet() {
  const [accountsInfo, setAccountsInfo] = useState<AccountInfo[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);

  const connect = async () => {
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

  const disconnect = () => {
    setAccountsInfo([]);
    setError(null);
  };

  return { accountsInfo, error, isConnecting, connect, disconnect };
}