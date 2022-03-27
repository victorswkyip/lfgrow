import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EngineComponent } from './engine/engine.component'; 
import { ProfileCreationComponent } from './profile-creation/profile-creation.component'; 

const routes: Routes = [ 
  { path: 'scene', component: EngineComponent },
  { path: 'create-profile', component: ProfileCreationComponent }, 
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})

export class AppRoutingModule { }