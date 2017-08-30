import { Component, OnInit, Input } from '@angular/core';

import { ActorComponent } from '../shared/actor/actor.component';

@Component({
  selector: 'hs-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.scss']
})
export class CardComponent extends ActorComponent implements OnInit {
   
    @Input('actor') actor:any;
    card: any;
    
    DEFAULT_SUBS: any = [
        {to: 'manaAmountChanged', call: 'recheckValidCards'}
    ];
    
    ngOnInit() {
        this.card = this.actor; // for template
        super.ngOnInit();
        super.subscribeAction(this);
        super.subscribeHsEvents(this);
        this.actor.isValidActor = this._stateService.myTurn &&  this.checkManaCost();
    }
    
    callAction(effect, target, source){ 
        switch (effect.type) {
            case 'recheckValidCards': 
                this.actor.isValidActor = this.checkManaCost();
                break;
        }
    }
    
    checkManaCost(){
        return (this.actor.stats.manaCost <= this._actorService.myMana);
    }
}

    
    
