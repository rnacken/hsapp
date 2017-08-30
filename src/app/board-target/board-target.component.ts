import { Component, OnInit } from '@angular/core';

import { ActorComponent } from '../shared/actor/actor.component';

@Component({
  selector: 'hs-board-target',
  templateUrl: './board-target.component.html',
  styleUrls: ['./board-target.component.scss']
})
export class BoardTargetComponent extends ActorComponent implements OnInit {

    actor: any = {
        id: Math.round(Math.random()*99999),
        type: 'board-target',
        stats: false,
        rules: false,
        effect: false
    }
    pointerEvents: string = 'none';


    DEFAULT_SUBS: any = [
        {to: 'startDragTargetBoard', call: 'activateBoardTarget'},
        {to: 'stopDragTargetBoard', call: 'deactivateBoardTarget'}
    ];
    
    ngOnInit() {
        super.ngOnInit();
        super.subscribeAction(this);
        super.subscribeHsEvents(this);
    }
    
    callAction(effect, target, source){ 
        switch (effect.type) {
            case 'activateBoardTarget': 
                this.pointerEvents = 'auto';
                break;
            case 'deactivateBoardTarget': 
                this.pointerEvents = 'none';
                break;
            case 'blastHero':
                this._targetService.hsEvent = {
                    name: 'blastHeroEvent',
                    target: target,
                    source: source,
                    params: { amount: 5 }
                };
                break;
        }
    }

}
