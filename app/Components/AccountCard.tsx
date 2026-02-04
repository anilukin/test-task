import { Card } from 'react-bootstrap';
import { AccountInfo } from '../types/types';

type AccountCardProps = {
  account: AccountInfo;
  idx: number;
};

export function AccountCard({ account, idx }: AccountCardProps) {
  return (
    <Card className='col-md-6 m-1'>
      <Card.Body>
        <Card.Header className='bg-transparent'>
          <strong>Account {idx + 1}:</strong>
          <br />
          {account.address}
        </Card.Header>
        <div className='d-flex align-items-center gap-3 p-3'>
          <Card.Text className='m-0 fw-bold'>Balance:</Card.Text>
          <div className='d-flex flex-column gap-1'>
            <Card.Text className='m-0'>{account.ethBalance} ETH</Card.Text>
            <Card.Text className='m-0'>{account.usdtBalance} USDT</Card.Text>
          </div>
        </div>
      </Card.Body>
    </Card>
  );
}
