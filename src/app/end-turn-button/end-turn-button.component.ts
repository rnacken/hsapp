import { Component, OnInit } from '@angular/core';
import { ActorComponent } from '../shared/actor/actor.component';

@Component({
  selector: 'hs-end-turn-button',
  templateUrl: './end-turn-button.component.html',
  styleUrls: ['./end-turn-button.component.scss']
})
export class EndTurnButtonComponent extends ActorComponent implements OnInit {
    
    actor: any = {
        id: Math.round(Math.random()*99999),
        type: 'end-turn-button',
        rules: false,
        stats: false,
        effect: false
    }
    
    DEFAULT_SUBS: any = [];
    
    myTurn: boolean = true;

    ngOnInit(){
        super.ngOnInit();
        super.subscribeAction(this);
        super.subscribeHsEvents(this);
    }
    
    endTurn(){
        this._stateService.endTurn();
    }
    
    callAction(effect, target, source){
        switch (effect.type) {

        }
    }
}
