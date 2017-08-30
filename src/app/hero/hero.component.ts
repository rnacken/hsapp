import { Component, OnInit, Input } from '@angular/core';

import { ActorComponent } from '../shared/actor/actor.component';

@Component({
  selector: 'hs-hero',
  templateUrl: './hero.component.html',
  styleUrls: ['./hero.component.scss']
})
export class HeroComponent extends ActorComponent implements OnInit {

    @Input('actor') actor:any;
    hero: any;
        
    DEFAULT_SUBS: any = [
        {to: 'blastHeroEvent', call: 'blastHeroAction'},
        {to: 'myHeroFatigue', call: 'myHeroFatigueDamage'}
    ];
  
    ngOnInit(){
        this.hero = this.actor; // for template
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
                    name: 'heroDamaged',
                    target: target,
                    source: source
                };
                if (this.actor.stats.hp <= 0){
                    console.log('death', this.actor.name);
                    this._targetService.hsEvent = {
                        name: 'heroDeath',
                        target: target,
                        source: source
                    };
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
                        name: 'heroHealed',
                        target: target,
                        source: source
                    };
                }
                break;
            case 'blastHeroAction':
                if (this.actor.stats.isEnemy){
                    this._targetService.action = {
                        effect: {
                            type: 'damage',
                            amount: effect.params.amount || 0
                        },
                        target: this.actor,
                        source: source
                    }
                }
                break;
            case 'myHeroFatigueDamage': 
                if (!this.actor.stats.isEnemy){
                    this._targetService.action = {
                        effect: {
                            type: 'damage',
                            amount: effect.params.fatigueDamage
                        },
                        target: this.actor,
                        source: false
                    }
                }
                break;
        } 
    }

}
