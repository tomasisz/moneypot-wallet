import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import * as bip39 from '../../bip39';
import WalletDatabase from '../../wallet/database';
import { setWallet } from '../../state/wallet';
import { Button, Form, FormGroup, Label, Input, Col, UncontrolledCollapse } from 'reactstrap';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.min.css';
import LeftPanel from './left-panel';

const defaultCustodian = 'https://www.moneypot.com/api/dev#pubhi1q0nx078gh7mzf3jd7t6ey72plqre0laqy9q9g7x9cfn762xupmkrzf66sn0';

export default function CreateWallet(props: any) {
  const [walletName, setWalletName] = useState('main');

  const [custodianUrl, setCustodianUrl] = useState(defaultCustodian);
  const [password, setPassword] = useState('');
  const [seed, setSeed] = useState(bip39.generateMnemonic());

  async function createWallet() {
    const db = await WalletDatabase.create(walletName, custodianUrl, seed, password);
    if (db instanceof Error) {
      console.error(db);
      toast.error('Oops! ' + db.message);
      return;
    }
    setWallet(db);
    props.setIsWalletSet(true);
    console.log('wallet created: ', walletName);
  }
  return (
    <div className="full-page-container">
      <ToastContainer />
      <LeftPanel />
      <div className="full-page-right-side">
        <h3 className="main-heading">Create New Wallet</h3>
        <Form>
          <FormGroup row>
            <Label for="walletName" sm={4}>
              Name
            </Label>
            <Col sm={{ size: 8, offset: 0 }}>
              <Input value={walletName} onChange={e => setWalletName(e.target.value)} placeholder="Name" type="text" name="walletName" required />
            </Col>
          </FormGroup>
          <FormGroup row>
            <Label for="custodianUrl" sm={4}>
              Custodian URL:
              <br />
              <small id="toggler">What is this?</small>
            </Label>
            <Col sm={{ size: 8, offset: 0 }}>
              <Input value={custodianUrl} name="custodianUrl" onChange={e => setCustodianUrl(e.target.value)} list="default=custodian-urls" />
              <datalist id="default=custodian-urls">
                <option value="https://www.moneypot.com/api/dev#pubhi1q0nx078gh7mzf3jd7t6ey72plqre0laqy9q9g7x9cfn762xupmkrzf66sn0" />
                <option value="http://localhost:3030" />
              </datalist>
            </Col>
            <UncontrolledCollapse toggler="#toggler">
              <p className="custodian-url-text">The Custodian Url is the one for connecting to the server that is responsible of managing your funds.</p>
            </UncontrolledCollapse>
          </FormGroup>
          <FormGroup row>
            <Label for="password" sm={4}>
              Password
            </Label>
            <Col sm={{ size: 8, offset: 0 }}>
              <Input value={password} onChange={e => setPassword(e.target.value)} placeholder="Password" type="password" name="password" />
            </Col>
          </FormGroup>

          <FormGroup row>
            <Col className="submit-button-container">
              <Button color="success" className="btn-moneypot" onClick={createWallet}>
                Create Wallet
              </Button>
            </Col>
          </FormGroup>
          <small className="text-secondary">
            By creating a wallet submit you are agreeing to moneypot's <a href="">Terms and Conditions</a>, <a href="">Cookies</a> and{' '}
            <a href="">Privacy Policy</a>.
          </small>
        </Form>

        <p>Already have a wallet? Restore</p>
      </div>
    </div>
  );
}
