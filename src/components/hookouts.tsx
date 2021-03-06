import React from 'react';
import * as hi from 'moneypot-lib';

import { Link } from 'react-router-dom';
import { wallet, useClaimableKinds } from '../state/wallet';

import * as Docs from '../wallet/docs';

export default function Hookins() {
  const hookouts = useClaimableKinds('Hookout');

  if (hookouts === 'LOADING') {
    return <p>Loading..</p>;
  }

  return (
    <div>
      <h1>Hookouts ( {hookouts.length} )</h1>
      <table className="table">
        <tbody>
          <tr>
            <th>#</th>
            <th>bitcoin address</th>
            <th>amount</th>
            <th>created</th>
          </tr>
          {hookouts.map(hookout => (
            <Hookout key={hookout.hash} hookoutDoc={hookout as Docs.Claimable & hi.POD.Hookout} />
          ))}
        </tbody>
      </table>
    </div>
  );
}

function Hookout({ hookoutDoc }: { hookoutDoc: Docs.Claimable & hi.POD.Hookout }) {
  return (
    <tr>
      <td>
        <Link to={`/claimables/${hookoutDoc.hash}`}>{hookoutDoc.hash.substring(0, 8)}...</Link>
      </td>
      <td>
        {' '}
        <a href={`https://blockstream.info/testnet/address/${hookoutDoc.bitcoinAddress}`} target="_blank">
          {hookoutDoc.bitcoinAddress}
        </a>
      </td>
      <td>{hookoutDoc.amount} sats</td>
      <td>{hookoutDoc.created.toISOString()}</td>
    </tr>
  );
}
