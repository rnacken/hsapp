import { Component } from '@angular/core';
import { StateService } from './shared/state.service';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})
export class AppComponent {
    title = 'hs-app';

    constructor(private _state: StateService) {
        this.init();
    }
    
    init(){
        this._state.init();
    }
    
    registerAndLogin(name: string) {
        this._state.registerAndLogin(name);
    }

    logout(player: any) {
        this._state.logout(player);
    }
  
    challenge(player: any){
        this._state.challenge(player);
    }
   
}
