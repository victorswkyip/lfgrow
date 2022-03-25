// github.com/divanov11/group-video-chat -->

import { Injectable } from '@angular/core';
import AgoraRTC from 'agora-rtc-sdk-ng';

@Injectable({
  providedIn: 'root'
})
export class AgoraRtcService {

  constructor() { }

  APP_ID: any = "383d84e52975434d9b89329118caf7a3";
  TOKEN: any = "006383d84e52975434d9b89329118caf7a3IACXNT3WWi8WAuJtp9tucEUN/MfM0TKGh0uN/S3VIxM3RGTNKL8AAAAAEACNSCPiGr43YgEAAQAavjdi";
  CHANNEL: any = "main";

  client: any = AgoraRTC.createClient({ mode: 'rtc', codec: 'vp8' });

  localTracks: any = [];
  remoteUsers: any = {};

  joinAndDisplayLocalStream = async () => {

    this.client.on('user-published', this.handleUserJoined);

    this.client.on('user-left', this.handleUserLeft);

    let UID = await this.client.join(this.APP_ID, this.CHANNEL, this.TOKEN, null);

    this.localTracks = await AgoraRTC.createMicrophoneAndCameraTracks();

    this.localTracks[1].play(`user-${UID}`);

    await this.client.publish([this.localTracks[0], this.localTracks[1]]);
  }

  joinStream = async () => {
    await this.joinAndDisplayLocalStream();
  }


  handleUserJoined = async (user, mediaType) => {
    this.remoteUsers[user.uid] = user;
    await this.client.subscribe(user, mediaType);

    if (mediaType === 'audio') {
      user.audioTrack.play();
    }
  }

  handleUserLeft = async (user) => {
    delete this.remoteUsers[user.uid]
  }

  leaveAndRemoveLocalStream = async () => {
    for (let i = 0; this.localTracks.length > i; i++) {
      this.localTracks[i].stop()
      this.localTracks[i].close()
    }

    await this.client.leave()
  }

  toggleMic = async () => {
    if (this.localTracks[0].muted) {
      await this.localTracks[0].setMuted(false)
    } else {
      await this.localTracks[0].setMuted(true)
    }

  }

}

//discovery: 
//audioeffects (remote volume setting with gain and pan) is not possible with agora web sdk
//alternatives: 
//react-native-sdk? - doesnt work without reworking the jsx loaders and runtime bundling
//hybrid sol'n: distance via setting volume of ind. tracks https://docs.agora.io/en/Interactive%20Broadcast/volume_web_ng?platform=Web and pan by splitting audio context https://stackoverflow.com/questions/20287890/audiocontext-panning-audio-of-playing-media
//go pure unity - https://www.youtube.com/watch?v=uM89bDIrmZ0
//inhouse solution w/o agora: pan by splitting audio context, but then you need to develop your own adaptor for ios devices - check MDN
//continue using agora by .net application on backend with webassembly  - https://medium.com/bb-tutorials-and-thoughts/how-to-develop-and-build-angular-app-with-net-core-backend-308b04cbbed5
//pure javascript spatial audio https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API/Web_audio_spatialization_basics

//algorithm
//import agorasdk - done
//create ui to connect/disconnect/mute - done
//add an agoraid property to local player object - done
//assign local player agoraid property to response uid string upon joining in engine
//create a mapping with a key of type player id to the value of "spatial audio"
//for each player who isn't the local player 
//if their agoraid property is defined, 
//getgain and getpan from them (wrt to position)
//create an audio effect manager 


//we need to refactor by:
//creating a dotenv file to hold sdk keys or dynamically generate keys
//somehow get the button rendering to be here and not on the engine

