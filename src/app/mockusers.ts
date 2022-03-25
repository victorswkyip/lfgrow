import { Vector3 } from 'three';
import { Pov } from './pov';
// this will be a future npc list

export const USERS: Pov[] = [
    { id: '11', name: 'firstuser', position: new Vector3(0, 1.6, 0)},
    { id: '12', name: 'seconduser', position: new Vector3(1.6, 1.6, 0)},
    { id: '13', name: 'thirduser', position: new Vector3(1.6, 1.6, 1.6)},
    { id: '14', name: 'fourthuser', position: new Vector3(0, 1.6, 1.6)},
    { id: '15', name: 'fifthuser', position: new Vector3(1.13, 1.6, 1.13)},

];