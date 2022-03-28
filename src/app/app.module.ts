import { BrowserModule } from '@angular/platform-browser';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { EngineComponent } from './engine/engine.component';
import { AgoraRtcService } from './services/agora-rtc.service';
import { WebSocketService } from './services/web-socket.service';
import { ApolloClientService } from './services/lens-api/apollo-client.service';
import { ProfileCreationComponent } from './profile-creation/profile-creation.component';
import { FormsModule } from '@angular/forms'; 

@NgModule({
  declarations: [
    AppComponent,
    EngineComponent,
    ProfileCreationComponent, 
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule
  ],
  providers: [
    { provide: Window, useValue: window },
    AgoraRtcService, 
    WebSocketService,
    ApolloClientService],
  bootstrap: [AppComponent]
})
export class AppModule { }