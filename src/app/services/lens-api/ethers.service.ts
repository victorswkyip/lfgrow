import { TypedDataDomain, TypedDataField } from '@ethersproject/abstract-signer';
import { ethers, utils, Wallet } from 'ethers';
import { MUMBAI_RPC_URL, PK } from '../../config';
import { omit } from '../../helpers';

// import Moralis from 'moralis/dist/moralis.min.js';
// import { ethers, utils, Wallet } from 'ethers';
// import { environment } from 'src/environments/environment';

// TODO: sign transactions with metamask instead of a private key
// export const web3Provider = Moralis.enableWeb3();
// var address: any;

// // const ethers = Moralis.web3Library;

// export const initWeb3 = async () =>{
//   const serverUrl = environment.MORALIS_SERVER_URL;
//   const appId = environment.MORALIS_APP_ID;
//   await Moralis.start({ serverUrl, appId })
//   await Moralis.authenticate().then(function (user) {
//     address = user.get('ethAddress');
//   })
// }


export const ethersProvider = new ethers.providers.JsonRpcProvider(MUMBAI_RPC_URL);

export const getSigner = () => {
  return new Wallet(PK, ethersProvider);
  // return new Wallet(address, web3Provider);
};

export const getAddressFromSigner = () => {
  return getSigner().address;
};

export const signedTypeData = (
  domain: TypedDataDomain,
  types: Record<string, TypedDataField[]>,
  value: Record<string, any>
) => {
  const signer = getSigner();
  // remove the __typedname from the signature!
  return signer._signTypedData(
    omit(domain, '__typename'),
    omit(types, '__typename'),
    omit(value, '__typename')
  );
};

export const splitSignature = (signature: string) => {
  return utils.splitSignature(signature);
};

export const sendTx = (
  transaction: ethers.utils.Deferrable<ethers.providers.TransactionRequest>
) => {
  const signer = getSigner();
  return signer.sendTransaction(transaction);
};

export const signText = (text: string) => {
  return getSigner().signMessage(text);
};