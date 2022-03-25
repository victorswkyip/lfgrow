import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { apolloClient } from './services/lens-api/apollo-client.service';
import { gql } from '@apollo/client/core'
import { lensHub } from './lenshub';
import { profiles } from './services/lens-api/get-profiles.service';
import { MoralisService } from './services/moralis.service';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  title = 'LFGrow';

  constructor(private router: Router, private moralisService: MoralisService) { }

  ngOnInit(): void {
    this.onInitQuery();
    this.moralisService.initialize()
    this.moralisService.login();
    profiles().then(response => {
        if (response.profiles.pageInfo.totalCount === 0) {
          console.log('wallet has no user profiles. let us create one.');
          this.router.navigate(["create-profile"]);
        }
        else {//working right here to replace for when it
          console.log(response.profiles.pageInfo.totalCount);
          this.router.navigate(["scene"]);
        }


    });

  } // How do i get moralis to work with ethers.js so that I dont need PK

  onInitQuery = async () => {
    const ping = `query { ping }`;
    const pong = await apolloClient.query({
      query: gql(ping),
    })
    console.log('Receive server pong: ', pong);
    console.log(`Total profile supply: ${await lensHub.totalSupply()}`);

  }

  async getProfile() {
    //disconnection here between moralis and ethers.js
    profiles().then(response => {
      if (response.profiles.pageInfo.totalCount === 0) {
        console.log('wallet has no user profiles. let us create one.');
        this.router.navigate(["create-profile"]);
      }
      else {//working right here to replace for when it
        console.log(response.profiles.pageInfo.totalCount);
        this.router.navigate(["create-profile"]);
      }
    });

  }

}


    // initiliaze all web3 dependent scripts for metamask to pop up
    // we integrated metamask with our code compilation. under the the fact that we set our environmental variables accordingly
    // checks if the wallet address has or hasn't a profile created - done
    // if none, it creates one - done
    // if has, it loads the profile
    // so we mint a profile on mumbai testnet i assume
    // could we mint on our own chain? why would we want to? to implement our own modules, but right now we just need approvefollow
    // input the user that we would like to follow
    // autofollow myself or should i make a ui that executes it

    //TODO:
    // implement ability to create a profile without my own wallet PK
    // log them in with their wallet, display profiles, and display ability to create one
    // mint avatar, and set to profile picture
    // create a profile for a user if they don't have one
    // enter them inside vr - they select their avatar
    // 