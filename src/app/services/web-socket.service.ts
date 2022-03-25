// Architecture notes: This is THE websocket service, meant to pass world state data for player rendering
// https://javascript-conference.com/blog/real-time-in-angular-a-journey-into-websocket-and-rxjs/
// Note: For reconnection: https://github.com/lamisChebbi/ng-realtime-dashboard/blob/master/src/app/services/data.service.ts
// Lamis's architecture pattern | we can't multiplex of pipeable subjects or multiplex is absent in websocketsubjects definition. observing and observer makes it an observable and no longer and an observer-> can move forward with that being cool but would 1. sacrifice multiplexing for manual conditional checking instead and, 2. expanding beyond the open source


import { Injectable, EventEmitter } from '@angular/core';
import { WebSocketSubject, webSocket } from 'rxjs/webSocket';
import { environment } from '../../environments/environment';
import { EMPTY, Observable, Subject, Subscription, timer } from 'rxjs';
import { catchError, delayWhen, retryWhen, switchAll, tap } from 'rxjs/operators';
const WS_ENDPOINT = environment.wsEndpoint;
const RECONNECT_INTERVAL = environment.reconnectInterval;


@Injectable({
  providedIn: 'root'
})
export class WebSocketService {

  // This service communicates with the server side api for user management

  private socket: WebSocketSubject<any>
  public userReady: Observable<any>;
  public userUpdate: Observable<any>;
  public userLeft: Observable<any>;
  public subscriptions: Subscription[] = [];

  constructor() {
    // this.socket.subscribe((data) => {
    //   console.log(data);
    // }) 
  }

  // connect function that creates a new websocket observer subject and then initialize the multiplex
  public connect(): void {
    let wsOptions = { // websocket options for behaviour customization
      url: WS_ENDPOINT,
      openObserver: {
        next: () => {
          this.sendData(`[Websocket Service] connection opened`);
          console.log('status: connected to server')
        }
      },
      closeObserver: { //this never runs from closing tabs, only when server is down
        next: () => {
          this.sendData(`[Websocket Service] connection closing`);
          console.log('status: lost connection to server');
          this.socket = undefined;
          // this.reloadPage();
        }
      },
      deserializer: (e) => JSON.parse(e.data), //TODO: design an encoding/decoding algorithm
      serializer: (value) => JSON.stringify(value)
    }

    this.socket = webSocket(wsOptions); // websocket connection with the server api

    // declare multiplex filters
    this.userReady = this.socket.multiplex(
      () => this.serializeMessage(JSON.stringify(({ subscribe: 'userReady' }))), // sub
      () => this.serializeMessage(JSON.stringify(({ unsubscribe: 'userReady' }))),// unsub
      message => (typeof (message) === 'string' && JSON.parse(message).hasOwnProperty('userReady'))); // MEDIUM CHECK

    this.userLeft = this.socket.multiplex(
      () => this.serializeMessage(JSON.stringify(({ subscribe: 'userLeft' }))), // sub
      () => this.serializeMessage(JSON.stringify(({ unsubscribe: 'userLeft' }))),// unsub
      message => (typeof (message) === 'string' && JSON.parse(message).hasOwnProperty('userLeft'))); // WEAK-MEDIUM CHECK

    this.userUpdate = this.socket.multiplex(
      () => this.serializeMessage(JSON.stringify(({ subscribe: 'userUpdate' }))), // sub
      () => this.serializeMessage(JSON.stringify(({ unsubscribe: 'userUpdate' }))),// unsub
      message => (typeof (message) !== 'string')); // WEAK CHECK

  }

  // Close the websocket connection off this client
  public close(): void {
    this.socket.complete();
    this.socket = undefined;
    // this.isAlive = false;
  }

  // Send data from this client to websocket server 
  private sendData(data: any): void {
    this.socket.next(this.serializeMessage(data));
  }

  private serializeMessage(message: string): string {
    // We stringify here to be coherent with rxjs ws
    return JSON.stringify(message);
  }
  // f5 equivalent
  private reloadPage(): void { 
    this.subscriptions.forEach(subscription => subscription.unsubscribe());

    console.log('status: reloading connection to server in...');
    let i = RECONNECT_INTERVAL;
    setInterval(() => { // countdown console.log
      console.log(i / 1000);
      i = i - 1000;
    }, 1000);
    setTimeout(() => { // reload the page after an interval
      window.location.reload();
    }, RECONNECT_INTERVAL);
  }

  public sendState(data: object): void {
    const worldStateRegex = 'worldstate: ' //^worldstate\:/;
    let message = worldStateRegex + JSON.stringify(data);
    this.sendData(message);
  }

  public broadcast(data: object): void {
    const broadcastRegex = 'broadcast: ' //^broadcast\:/;
    let message = broadcastRegex + JSON.stringify(data);
    this.sendData(message);
  }

}