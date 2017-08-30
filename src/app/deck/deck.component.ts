import { Component, OnInit, Input } from '@angular/core';
import {
  trigger,
  state,
  style,
  animate,
  transition,
  keyframes
} from '@angular/animations';

import { ActorComponent } from '../shared/actor/actor.component';

@Component({
    selector: 'hs-deck',
    templateUrl: './deck.component.html',
    styleUrls: ['./deck.component.scss'],
    animations: [
        trigger('menuState', [
            state('inactive', style({pointerEvents: 'none'})),
            state('active', style({pointerEvents: 'auto', opacity: 1})),
            transition('* => inactive', [
                animate(300, keyframes([
                    style({opacity: 1, transform: 'scale(1,1)', offset: 0 }),
                    style({opacity: 0, transform: 'scale(0,1)', offset: 0.1 }),
                ]))
            ]),
            transition('inactive => active', [
                animate(1000, keyframes([
                    style({opacity: 0, transform: 'scale(0,1)', offset: 0 }),
                    style({opacity: 1, transform: 'scale(1,1)', offset: 0.1 }),
                ]))
            ]),
            state('active-targeting', style({opacity: 1, transform: 'translateX(-264px) scale(1,1)'})),
            transition('active => active-targeting', [
                animate(1000, keyframes([
                    style({opacity: 1, transform: 'translateX(0) scale(1,1)', offset: 0 }),
                    style({opacity: 1, transform: 'translateX(-264px) scale(1,1)', offset: 0.1 }),
                ]))
            ]),
            transition('active-targeting => active', [
                animate(1000, keyframes([
                    style({opacity: 1, transform: 'translateX(-264px) scale(1,1)', offset: 0 }),
                    style({opacity: 1, transform: 'translateX(0) scale(1,1)', offset: 0.1 }),
                ]))
            ]),
        ])
  ]
})
export class DeckComponent extends ActorComponent implements OnInit {
    
    @Input('cards') cards:any;
    
    actor: any = {
        id: Math.round(Math.random()*99999),
        type: 'deck',
        rules: false,
        stats: false,
        effect: false
    }
    fatigueDamage: number = 1;
     
    menuState: string = 'inactive';
    isTargeting: boolean = false;
    
    DEFAULT_SUBS: any = [
        {to: 'newTurnStarted', call: 'drawCard'}
    ];  
    
    ngOnInit() {
        super.ngOnInit();
        super.subscribeAction(this);
        super.subscribeHsEvents(this);
        this.cards = this.shuffleCards(this.cards);
        this.takeCardInHand();
        
        this._targetService.hsEvent
        .subscribe(event => {
            if (event.name === 'startTargeting' && this.menuState === 'active'){
                this.menuState = 'active-targeting';
            }
            if (event.name === 'stopTargeting' && this.menuState === 'active-targeting'){
                this.menuState = 'active';
            }

        });
    }
    
    toggleCardsMenu(active){
        this.menuState = (active)? 'active': 'inactive';
    }
    
    shuffleCards(array:any[]) : any[]{
        for (let i = array.length; i; i--) {
            let j = Math.floor(Math.random() * i);
            [array[i - 1], array[j]] = [array[j], array[i - 1]];
        }
        return array;
    }
    
    takeCardInHand(){
        if (this.cards.length===0){
            // fatigue mode
            this._targetService.hsEvent = {
                    name: 'myHeroFatigue',
                    target: null,
                    source: null,
                    params: { fatigueDamage: this.fatigueDamage }
                };
            this.fatigueDamage++;
            return false;
        }
        let newCard = this.cards.shift();
        this._actorService.myCardsInHand.push(newCard);
    }
    
    callAction(effect, target, source){ 
        switch (effect.type) {
            case 'drawCard':
                this.takeCardInHand();
                break;
        }
    }   
}
