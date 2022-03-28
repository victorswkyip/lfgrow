import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router'; 
import { MoralisService } from './services/moralis.service';
import { profiles } from './services/lens-api/get-profiles.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  title = 'LFGrow';

  constructor(private router: Router, private moralisService: MoralisService) { }

  ngOnInit(): void { 
    // this.moralisService.initialize().then(() => {
    //   this.moralisService.login();
    // })
    // profiles().then(response => {
    //   if (response.profiles.pageInfo.totalCount === 0) {
    //     console.log('wallet has no user profiles. let us create one.');
    //     this.router.navigate(["create-profile"]);
    //   }
    //   else {
    //     this.router.navigate(["scene"]);
    //   } 
    // });

  }  
}
 