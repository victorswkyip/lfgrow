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
    // this.moralisService.initialize().then(() => {
    //   this.moralisService.login();
    // })
    // profiles().then(response => {
    //   if (response.profiles.pageInfo.totalCount === 0) {
    //     console.log('wallet has no user profiles. let us create one.');
    //     this.router.navigate(["create-profile"]);
    //   }
    //   else {
    //     this.router.navigate(["select-profile"]);
    //   } 
    // });

  }  

  onInitQuery = async () => {
    const ping = `query { ping }`;
    const pong = await apolloClient.query({
      query: gql(ping),
    })
    console.log('Receive server pong: ', pong);
    console.log(`Total profile supply: ${await lensHub.totalSupply()}`);
  }
}
 