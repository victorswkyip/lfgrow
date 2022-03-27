import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Moralis } from 'moralis/dist/moralis.min.js';


@Injectable({
  providedIn: 'root'
})
export class MoralisService {

  constructor() { }

  async initialize(): Promise<void> {
    const serverUrl = environment.MORALIS_SERVER_URL;
    const appId = environment.MORALIS_APP_ID;
    await Moralis.start({ serverUrl, appId })
    console.log('moralis: started');
  }

  async login(): Promise<void> { //connect metamask wallet
    Moralis.Web3.authenticate().then((user: any) => {
      // console.log(user);
      // console.log(user.get('ethAddress'));
      console.log('moralis: authenticated');
    })

  }
} 