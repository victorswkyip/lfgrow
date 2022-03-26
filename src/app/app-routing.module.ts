import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EngineComponent } from './engine/engine.component';
import { NavigationComponent } from './navigation/navigation.component';
import { ProfileCreationComponent } from './profile-creation/profile-creation.component';
import { ProfileSelectionComponent } from './profile-selection/profile-selection.component';

const routes: Routes = [
  { path: 'nav', component: NavigationComponent },
  { path: 'scene', component: EngineComponent },
  { path: 'create-profile', component: ProfileCreationComponent },
  { path: 'select-profile', component: ProfileSelectionComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})

export class AppRoutingModule { }