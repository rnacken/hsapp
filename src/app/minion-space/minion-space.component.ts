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
  selector: 'hs-minion-space',
  templateUrl: './minion-space.component.html',
  styleUrls: ['./minion-space.component.scss'],
  animations: [
        trigger('minionSpaceState', [
            state('beingDestroyed', style({opacity: 1, width: 0})),
            transition('* => beingDestroyed', [
                animate(1000, keyframes([
                    style({opacity: 1, width: '*', offset: 0.5 }),
                    style({opacity: 0, width: 0, offset: 0.7 })
                ]))
            ])
        ])
    ]
})
export class MinionSpaceComponent extends ActorComponent implements OnInit {
    
    // todo; clean up space&minion stuff; space is only used right at the start. combine it in minion-obj?
    @Input('minion') minion: any;
    @Input('nextMinion') nextMinion: any;

    @Input('space') space: any;

    actor: any;    
    minionSpace: any;
   
    state: string = 'none';
    
    DEFAULT_SUBS: any = [
        {to: 'minionDeath', call: 'removeMinionSpace'}
    ];
    
    ngOnInit() {
        this.actor = {
            id: 80000 + Math.round(Math.random()*9999),
            name: 'Minion space', 
            type: 'minion space',
            isEnemy: this.space.isEnemy,
            rules: {
                cannotTarget: true, 
            }
        };
        this.minionSpace = this.actor;
        super.ngOnInit();
        super.subscribeAction(this);
        super.subscribeHsEvents(this); 
    }
        
    callAction(effect, target, source){
        switch (effect.type) {
             case 'playMinion': 
                console.log(effect, target.id, source.id, this.actor.id);
                let minion: any = this._actorService.minions.filter(minion => {
                    return minion.id === effect.minionId;
                });
                if (minion.length > 0){
                    minion = minion[0];
                } else {
                    // no correct id found -> error
                    break;
                }
                minion.stats.isEnemy = false;
                
                if (this.space.pos === this.space.total-1){
                     //last place - push it;
                    this._actorService.myMinions.push(minion);
                } else {
                    this._actorService.myMinions.splice(this.space.pos, 0, minion);
                }
                break;
              
            case 'removeMinionSpace':
                let newLastPos = this.space.pos === this.space.total-2;
                if ((this.minion && this.minion.id === target.id) 
                    || (this.nextMinion && this.nextMinion.id === target.id && newLastPos)){ // this part checks if the remaining minion on the right should get rid of its minion-space

                    this.animateMinionSpace(750, 'beingDestroyed', () => {
                        // no further action needed; the removal from the array happens in minion component
                    }); 
                }
                break;
        } 
    }
    
    animateMinionSpace(animationTime: number, state: string, callbackFn){
        this.state = state;
        if (callbackFn){
            setTimeout(() => {
                this.state = 'none';
                callbackFn()
            }, animationTime);
        }
    }
}
