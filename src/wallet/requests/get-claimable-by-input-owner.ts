import * as hi from 'moneypot-lib';
import Config from '../config';
import makeRequest, { RequestError } from './make-request';

export default async function getClaimableByInputOwner(config: Config, inputOwnerStr: string) {
  const url = `${config.custodianUrl}/claimable-by-input-owner/${inputOwnerStr}`;

  const claimablePOD = await makeRequest<(hi.POD.Claimable & hi.POD.Acknowledged) | null>(url);

  if (claimablePOD instanceof RequestError) {
    throw claimablePOD;
  }
  if (!claimablePOD) {
    return undefined;
  }

  const ackdClaimable = hi.Acknowledged.claimableFromPOD(claimablePOD);
  if (ackdClaimable instanceof Error) {
    console.error(ackdClaimable);
    throw new Error('could not parse claimable');
  }

  const claimable = ackdClaimable.contents;

  if (!(claimable instanceof hi.AbstractTransfer)) {
    throw new Error('got a claimable by input owner, that was not actually an abstract transfer');
  }

  let found = false;
  for (const input of claimable.inputs) {
    if (input.owner.toPOD() === inputOwnerStr) {
      found = true;
      break;
    }
  }

  if (!found) {
    throw new Error('got a claimable that didnt have correct input owner');
  }

  // TODO: verify auth...

  return ackdClaimable;
}
