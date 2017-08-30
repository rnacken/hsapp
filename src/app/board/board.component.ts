import { Component, OnInit } from '@angular/core';

import { ActorComponent } from '../shared/actor/actor.component';

@Component({
  selector: 'hs-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.scss']
})
export class BoardComponent extends ActorComponent implements OnInit {
  
    actor: any = {
        id: Math.round(Math.random()*99999),
        type: 'board',
        rules: false,
        stats: false,
        effect: false
    }
    
    myHero: any[];
    myHeroPower: any[];
    enemyHero: any[];
    myMinions: any[];
    enemyMinions: any[];
    myCards: any[];
    myCardsInHand: any[] = [];
    myMana: number = 0;
    myManaMax: number = 0;
              
    cursorStyle: string = 'auto';
    
    DEFAULT_SUBS: any = [
        {to: 'turnEnded', call: 'startNewTurn'},
        {to: 'spendMana', call: 'spendManaAction'},
        {to: 'cardPlayed', call: 'removeCardFromHand'},
        {to: 'startTargeting', call: 'hideMouse'},
        {to: 'stopTargeting', call: 'showMouse'}
    ];

    ngOnInit() {
        this.myHero = this._actorService.myHero;
        this.myHeroPower = this._actorService.myHeroPower;
        this.enemyHero = this._actorService.enemyHero;
        this.myMinions = this._actorService.myMinions;
        this.enemyMinions = this._actorService.enemyMinions;
        this.myCards = this._actorService.myCards;
        this.myCardsInHand = this._actorService.myCardsInHand;
        this.myMana = this._actorService.myMana;   
        
        super.ngOnInit();
        super.subscribeAction(this);
        super.subscribeHsEvents(this);

       
        this.startNewTurn();
    }
    
    startNewTurn(){
        // get new mana crystal
        this._actorService.myManaMax++; 
        if (this._actorService.myManaMax > 10){
            this._actorService.myManaMax = 10; // max amount
        }
        this._actorService.myMana = this._actorService.myManaMax;
        this.myManaMax = this._actorService.myManaMax;
        this.myMana = this._actorService.myMana;
        
        this._targetService.hsEvent = {
            name: 'manaAmountChanged',
            target: null,
            source: null
        };
        
        // get new card for new turn (see deck)
        this._targetService.hsEvent = {
            name: 'newTurnStarted',
            target: false,
            source: false
        };
    }

    callAction(effect, target, source){ 
        switch (effect.type) {
            case 'hideMouse':
                this.cursorStyle = 'none';
                break;
            case 'showMouse':
                this.cursorStyle = 'auto';
                break;
            case 'removeCardFromHand': 
                // remove card from hand array
                this._actorService.myCardsInHand = this._actorService.myCardsInHand.filter((card)=>{
                    return (card.id !== source.id);
                });
                this.myCardsInHand = this._actorService.myCardsInHand;
                break;
            case 'spendManaAction': 
                let amount = effect.params.amount;
                this._actorService.myMana -= effect.params.amount;
                this._targetService.hsEvent = {
                    name: 'manaAmountChanged',
                    target: target,
                    source: source
                };
                break;
            case 'startNewTurn':
                let player = effect.params.player;
                if (this._stateService.myPlayer.uid === player.uid){
                    this.startNewTurn();
                }
                break;
        }
    }
}
