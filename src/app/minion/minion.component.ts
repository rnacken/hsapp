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
    selector: 'hs-minion',
    templateUrl: './minion.component.html',
    styleUrls: ['./minion.component.scss'],
    animations: [
        trigger('minionState', [
            state('none', style({transform: 'translate(0, 0)'})),
            state('takingDamage', style({transform: 'translate(0, 0)'})),
            transition('* => takingDamage', [
                animate(1000, keyframes([
                    style({opacity: 0.5, transform: 'translateX(-5px)', offset: 0 }),
                    style({opacity: 0.7, transform: 'translateX(5px)', offset: 0.1 }),
                    style({opacity: 1, transform: 'translateX(0)', offset: 0.2 })
                ]))
            ]),
            state('beingDestroyed', style({width: 0, opacity: 0, margin: 0})),
            transition('* => beingDestroyed', [
                animate(1000, keyframes([
                    style({opacity: 1, transform: 'scale(1,1) rotate(0deg)', offset: 0 }),
                    style({width: '*', margin: '*', opacity: 0, transform: 'scale(0.7,0.7) rotate(20deg)', offset: 0.5 }),
                    style({width: 0, margin: 0, offset: 0.7 })
                ]))
            ]),
        ])
]
})
export class MinionComponent extends ActorComponent implements OnInit {
    
    @Input('minion') actor:any 
    
    minion: any;
    state: string = 'none';
    animationTime: number = 0;
    
    DEFAULT_SUBS: any = [
        {to: 'damageAllMinions'},
        {to: 'minionDeath', call: 'destroy'}
    ];
  
    ngOnInit() {
        this.minion = this.actor; // for template
        super.ngOnInit();
        super.subscribeAction(this);
        super.subscribeHsEvents(this);
    }
    
    callAction(effect, target, source){
        // default behavior for minion = damage (attack).
        if (typeof effect.type === 'undefined'){
            effect.type = 'damage';
            effect.amount = source.stats.attack || 0;
        }
        switch (effect.type) {
            case 'damage': 
                this.actor.stats.hp -= (effect.amount || 0);
                this._targetService.hsEvent = {
                    name: 'minionDamaged',
                    target: target,
                    source: source
                };
                this.animateMinion(200, 'takingDamage', () => {
                    if (this.actor.stats.hp <= 0){
                        console.log('death', this.actor.name);
                        this._targetService.hsEvent = {
                            name: 'minionDeath',
                            target: target,
                            source: source
                        };
                    }
                });
                break;
            case 'destroy': 
                if (this.actor.id === target.id){ 
                    this.animateMinion(750, 'beingDestroyed', () => {
                        // remove minion from array
                        //setTimeout(()=>{ 
                        let minionArray = (this.actor.isEnemy)? 'enemyMinions' : 'myMinions';
                        this._actorService.myMinions = this._actorService[minionArray].filter((_minion)=>{
                            return (_minion.id !== target.id);
                        });
                        //},6000);
                        this._targetService.hsEvent = {
                            name: 'minionDestroyed',
                            target: target,
                            source: source
                        };
                    }); 
                }
                break;
            case 'heal':
                let minionHp = this.actor.stats.hp;
                minionHp += (effect.amount || 0);
                if (minionHp > this.actor.stats.hpMax){
                    minionHp = this.actor.stats.hpMax;
                }
                if (minionHp > this.actor.stats.hp){
                    // hp changed
                    this.actor.stats.hp = minionHp;
                    this._targetService.hsEvent = {
                        name: 'minionHealed',
                        target: target,
                        source: source
                    };
                }
                break;
            case 'increaseHp': 
                this.actor.stats.hp += (effect.amount || 0);
                this.actor.stats.hpMax += (effect.amount || 0);
                break;
            case 'sayThanksOrCrap':
                if (target.stats.isEnemy){
                    console.log(this.actor.name,': aw crap!');
                } else {
                    console.log(this.actor.name,': thanks!');
                }
                break;
            case 'damageAllMinions':
                for (let minion of this._actorService.myMinions){
                    this._targetService.action = {
                        target: minion,
                        source: this.actor,
                        effect: {
                            type: 'damage',
                            amount: effect.amount || 1
                        }
                    }
                }
                for (let minion of this._actorService.enemyMinions){
                    this._targetService.action = {
                        target: minion,
                        source: this.actor,
                        effect: {
                            type: 'damage',
                            amount: effect.amount || 1
                        }
                    }
                }
                console.log('all will be burned!');

                break;  
            case 'addDamageAndHealth':
                let amount = effect.props.amount || 0;
                this.actor.stats.hp += amount;
                this.actor.stats.hpMax += amount;
                this.actor.stats.attack += amount;
                this.actor.stats.attackMax += amount;
                break;
        } 
    }
    
    animateMinion(animationTime: number, state: string, callbackFn){
        this.state = state;
        if (callbackFn){
            setTimeout(() => {
                this.state = 'none';
                callbackFn()
            }, animationTime);
        }
    }
    
}
