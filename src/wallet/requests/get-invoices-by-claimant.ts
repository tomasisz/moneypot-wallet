import * as hi from 'moneypot-lib';
import Config from '../config';
import makeRequest, { RequestError } from './make-request';
import { notError } from '../../util';

export default async function getInvoicesByClaimant(config: Config, claimant: hi.PublicKey) {
  const claimantStr = claimant.toPOD();
  const url = `${config.custodianUrl}/lightning-invoices-by-claimant/${claimantStr}`;

  const invoices = await makeRequest<(hi.POD.LightningInvoice & hi.POD.Acknowledged)[]>(url);

  if (invoices instanceof RequestError) {
    throw invoices;
  }

  if (!Array.isArray(invoices)) {
    throw new Error('lightning-invoices-by-claimant should have returned an array...');
  }

  for (const invoice of invoices) {
    if (invoice.claimant !== claimantStr) {
      throw new Error('lightning-invoices-by-claimant returned invoice with wrong claimant');
    }
  }
  // TODO: check the ack

  return invoices.map(s => {
    const claimable = notError(hi.Acknowledged.claimableFromPOD(s));
    if (!(claimable.contents instanceof hi.LightningInvoice)) {
      throw new Error('got something that was not a lightning invoice');
    }
    return claimable;
  });
}
