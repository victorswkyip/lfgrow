import { Component, OnInit, AfterViewInit, ElementRef, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { profiles } from '../services/lens-api/get-profiles.service';

@Component({
  selector: 'app-profile-selection',
  templateUrl: './profile-selection.component.html',
  styleUrls: ['./profile-selection.component.css']
})
export class ProfileSelectionComponent implements OnInit, AfterViewInit, OnDestroy {

  constructor(private router: Router) { }

  // profile_avatars_src: any = [];
  // blank: string = 'empty'

  ngOnDestroy(): void {
  }

  // for demo we are assuming that there is only 1 profile in a wallet, and if there is, then enter vr automatically
  // todo: support multiple profiles in a wallet - index profile_avatars_src to load other profile avatars owned

  ngOnInit(): void {
    profiles().then((response) => {
      let ownedProfiles = response.profiles.items;
      ownedProfiles.forEach(profile => { //iterate through each profile
        try {
          let hasAvatar = profile.picture.original.url; //get the avatar uri

          fetch(hasAvatar).then(response => { // get the image url 
            response.json().then(data => {
              // this.profile_avatars_src.push(data.image);
              let assetsElement = new ElementRef(document.getElementById('assets')); //inject source into aframe
              assetsElement.nativeElement.innerHTML = `<a-asset-item id="avatar" src="${data.image}" response-type="arraybuffer" ></a-asset-item>`;

              let avatarElement = new ElementRef(document.getElementById('avatar-container'));
              avatarElement.nativeElement.innerHTML = `<a-gltf-model src="#avatar" position="0 0 0" rotation="0 90 0" scale="0.005 0.005 0.005" animation-mixer="clip:Take 001; crossFadeDuration: 1"></a-gltf-model>`;
            });
          }).catch(err => {
            console.log('display image/avatar metadata not fetchable');
          })

        } catch (error) {  //the current iteration of profile doesnt have an imageuri
          // this.profile_avatars_src.push(this.blank);
        }
      });
    });
  }

  ngAfterViewInit(): void {
    // this.sceneElement = this.scene.nativeElement;

  }

  handleClickStart(): void {
    this.router.navigate(["scene"]).then(() => {
      window.location.reload()
    });
  }
}
