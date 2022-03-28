import { Component, OnInit, AfterViewInit, ViewChild, ViewChildren, ElementRef, HostListener, QueryList, OnDestroy } from '@angular/core';
import { Pov } from '../pov';
import { WebSocketService } from '../services/web-socket.service';
import { AgoraRtcService } from '../services/agora-rtc.service';
import { recommendedProfiles } from '../services/lens-api/get-recommended-profiles.service';
import { followers } from '../services/lens-api/followers.service';
import { Router } from '@angular/router';
import { profiles } from '../services/lens-api/get-profiles.service';
import Moralis from 'moralis/dist/moralis.min.js';
import { createPost } from '../services/lens-api/post.service';

@Component({
  selector: 'app-engine',
  templateUrl: './engine.component.html',
  styleUrls: ['./engine.component.css']
})
export class EngineComponent implements OnInit, AfterViewInit, OnDestroy {
  constructor(private router: Router, private webSocketService: WebSocketService, private agoraRtcService: AgoraRtcService) { }     // connect to the user service API and subscribe to server heartbeat
  // constructor(private webSocketService: WebSocketService) { }     // connect to the user service API and subscribe to server heartbeat

  // template references 
  // @ViewChild('scene', { static: false }) scene: ElementRef;
  @ViewChild('camera', { static: false }) camera: ElementRef;
  @ViewChildren('player') players: QueryList<ElementRef>
  @ViewChild('initSky', { static: false }) initSky: ElementRef;

  // Listen to DOM changes from mouse and keyboard events from Angular's HostListener decorator
  @HostListener('document:keydown', ['$event']) handleKeypressDownEvent(event: KeyboardEvent) {
    this.detectPlayerMove(event);
  }
  @HostListener('document:keyup', ['$event']) handleKeypressUpEvent(event: KeyboardEvent) {
    this.detectPlayerMove(event);
  }
  @HostListener('document:mousedown', ['$event']) handleMouseDownEvent(event: MouseEvent) {
    this.detectPlayerLook(event);
  }
  @HostListener('document:mouseup', ['$event']) handleMouseUpEvent(event: MouseEvent) {
    this.detectPlayerLook(event);
  }

  // Keep track of client state paramters
  private pov: Pov;
  // private sceneElement: any;
  private cameraElement: any;
  private users: any = [];

  storyFile: any;

  ngOnDestroy(): void {
    // note: can't unsubscribe from B or C for when player closes tab, for completeness 
    // this.subscriptions.forEach(subscription => subscription.unsubscribe)
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
    recommendedProfiles();
    followers();
    // connect to multiplayer server 
    this.webSocketService.connect();
  }
  // nativeElement only accessible in ngAfterViewInit
  ngAfterViewInit(): void {



    // this.sceneElement = this.scene.nativeElement;
    this.cameraElement = this.camera.nativeElement; // #player

    // initialize client pov parameters when the user ready message is recieved, 
    // TODO: currently flawed because if the msg is missed, we dont get it back. fix with a reconnection interval?   
    // fix should be client ended i think by completing and grabbing a new websocket handshake, as opposed to server ended
    const subA = this.webSocketService.userReady.subscribe(messageForUserReady => {
      this.pov = {
        id: JSON.parse(messageForUserReady).userReady.id,
        name: this.makeId(10) + new Date().getTime(),
        position: this.cameraElement.getAttribute('position'),
        rotation: this.cameraElement.getAttribute('rotation'),

      };
      this.webSocketService.sendState(this.pov);
      subA.unsubscribe();

      // TODO: we should handle the defining of audioid here

    });

    // update the view on other user disconnects
    const subB = this.webSocketService.userLeft.subscribe(messageForUserLeft => {
      let userIndex = this.users.findIndex((user: Pov) => user.id === JSON.parse(messageForUserLeft).userLeft) //some weird thing going on with JSON.parse. it still works even if I don't use JSON.parse, so its a string with a property
      this.users.splice(userIndex, 1);

    });

    // heartbeat to connect with the server
    const subC = this.webSocketService.userUpdate.subscribe((worldState: any) => {
      // console.log(worldState);
      this.handleServerTick(worldState)     // TODO: improvements can be made, current: server ticks despite unchanged, client multiplexes valid ticks; ideal case: server ticks only valid changes, client ticks possibly dynamically

      //TODO: update spatial audio properties here?
    });
  }

  handleServerTick(world: any): void {
    // Scan through the world state object which contains an array of worldUser objects 
    world.users.forEach(worldUser => {
      if (worldUser.id === this.pov.id) { //TODO: fixate camera at eye position and test for avatar movement stream
        // do nothing
      } else {
        // get user via iterating the server ended users with child elements with a player template reference in the DOM based on id 
        let existingPlayer = (this.players.find((player) => player.nativeElement.getAttribute('id') === worldUser.id));
        if (existingPlayer === undefined) { // if not found create the player child element via the users array 
          this.createUser(worldUser);
        }
        else { // else update the userElement in the DOM based on id
          let userElement = existingPlayer.nativeElement;
          this.updateUser(userElement, worldUser);
        }
      }
    });
    this.webSocketService.sendState(this.pov); //put this here instead of at the host listener callback
  }

  updateUser(userElement, worldUser): void {
    // overwrite former for latter
    userElement.object3D.position.set(
      worldUser.position.x,
      worldUser.position.y,
      worldUser.position.z
    );
    userElement.object3D.rotation.set(
      worldUser.rotation.x,
      worldUser.rotation.y,
      worldUser.rotation.z
    );
  }

  createUser(worldUser): void {
    // append new player pov object in state array
    this.users.push(worldUser);
    // TODO: ideally we want to setAttribute("gltf-model") right away but will need to run another service to do that on an appended child entity that wraps the avatar aframe asset entity
    // this.sceneElement.appendChild(userElement); // we will use this for things that pop up for client specific rendering
  }

  // TODO: Make it accessible to blind, ill, deaf, mute, imobile, mobile, rich, and poor users
  detectPlayerMove(event: KeyboardEvent): void {
    // If player presses WASD keys, send server update for the position property this client player 
    if (event.key === 'w' || event.key === 'a' || event.key === 's' || event.key === 'd') {
      this.pov.position = this.cameraElement.getAttribute('position');
    }
  }

  detectPlayerLook(event: MouseEvent): void {
    // If client drags mouse, send server update for the rotation property this client player 
    if (event.button === 0) { // 0 = left mouse button, 1 = middle button
      this.pov.rotation = this.cameraElement.getAttribute('rotation');
    }
  }

  // set up authentication
  makeId(length: number): string {
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";

    for (var i = 0; i < length; i++)
      text += possible.charAt(Math.floor(Math.random() * possible.length));

    return text;
  }

  joinVoice(): void {
    this.agoraRtcService.joinStream();
    let joinbtn = new ElementRef(document.getElementById('join-btn')).nativeElement;
    joinbtn.setAttribute('position', "0 -30 0");
    let leavebtn = new ElementRef(document.getElementById('leave-btn')).nativeElement;
    leavebtn.setAttribute('position', "-15 1 0");
  }

  leaveVoice(): void {
    this.agoraRtcService.leaveAndRemoveLocalStream();
    let leavebtn = new ElementRef(document.getElementById('leave-btn')).nativeElement;
    leavebtn.setAttribute('position', "0 -30 0");
    let joinbtn = new ElementRef(document.getElementById('join-btn')).nativeElement;
    joinbtn.setAttribute('position', "-15 3 0");
  }

  muteInput(): void {
    this.agoraRtcService.toggleMic();
    // console.log('mictoggled'); 
    let micbtn = new ElementRef(document.getElementById('mic-btn')).nativeElement;

    if (micbtn.getAttribute('muted') == 'true') {
      micbtn.children[0].setAttribute('value', "Mute Mic.");
      micbtn.setAttribute('muted', 'false');
    }
    else {
      micbtn.children[0].setAttribute('value', "Unmute Mic.");
      micbtn.setAttribute('muted', 'true');

    }
  }

  async showUploadUI(): Promise<void> {
    var el = new ElementRef(document.getElementsByClassName("a-enter-vr")).nativeElement;
    // el.item(0).innerHTML = `<app-upload-story></app-upload-story>`
    el.item(0).innerHTML = `<div><button (click)="submitPostInput()">Submit Post</button><input #uploadStory type="file" name="storyFile" id="storyFile"> <br></div> `

    // el3.classList.toggle('show');
    // Save file input to IPFS
    const storyFile = document.getElementById("storyFile");
    this.storyFile = storyFile;
    console.log('code wont reach the next point to upload submissiom. angular need to render the function calls on compile, so either go lower level to index.html to make function calls or consider viewcontainerref')

  }

  async uploadStory(): Promise<void> {
    console.log('we here');
    const data = this.storyFile.files[0]
    const file = new Moralis.File(data.name, data)
    await file.saveIPFS();
    console.log(file.ipfs(), file.hash());
    return file.ipfs();


  }

  getStoryContentURI = async (contentURL) => {
    const metadata = {
      "name": 'name',
      "description": 'description',
      "image": 'imageURL',
      "animation_url": contentURL,
      // "attributes": [
      //   {
      //     "trait_type": "type",
      //     "value": "value"
      //   },
      //   {
      //     "trait_type": "type2",
      //     "value": "value2"
      //   },
      // ]
    }
    const file = new Moralis.File("file.json", { base64: btoa(JSON.stringify(metadata)) });
    await file.saveIPFS();
    console.log(file.ipfs(), file.hash());
    return file.ipfs();
  }

  // TODO: fix flaw where if it ends up failing the contract tx to create profile, then we wasted resources uploading to ipfs
  submitPostInput = async () => {
    const content = await this.uploadStory();
    const contentURI = await this.getStoryContentURI(content);
    console.log(await createPost(contentURI));
  }


  playVideo() {
    console.log('it should play video');
    //change sky to video src specific to that portal
    // this.initSky.nativeElement.setAttribute('environment', null);
    // this.initSky.nativeElement.setAttribute('src', `#video1`);
    
    // = `<a-sky src=#video1></a-sky>`;



    let videoElement = new ElementRef(document.getElementById('video-container')); //inject source into aframe
    // videoElement.nativeElement.innerHTML = `<a-videosphere id="video" src="#video1" ></a-videosphere>`;
    videoElement.nativeElement.innerHTML = `<a-sky src=#video1></a-sky>`;
    // document.querySelector("#video1").components.material.material.map.image.play();


    let ui = new ElementRef(document.getElementById('ui-container')).nativeElement;
    ui.setAttribute('visible', 'false');


    //
  }

}


// DEV NOTES

// import aframe service - done
// create a position and rotation reader - done
// send the user data to the server - done
// create a user with such properties there - done
// update itself with all the other user position data - done 
// create a child element in the scene for each world user - done
// add a visual box that follows each player element - done
// identify connections for user removing and tracking - done
// implement reloading - done, save reconnection when we come back to pov.name 

// consider the design for the game
// environment design

// first add a portal by working with the html file in the scene tag
// then work by trying to dynamically loading world interactives (like the portal) upon scene load
// work on the second scene to dynamically load some things cool
// add a portal that can teleport you to a unity game on webgl with headjack api?

// avatars
// add aframe-entiy and add aframe-asset html tags for future child binding of avatar models
// pull an avatar source from lens protocol profile image uri
// 


// spatial audio
// create voice controller ui
// calculate gain and pan wrt two normal unit vectors
// filter volume accordingly