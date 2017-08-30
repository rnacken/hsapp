import { Component, OnInit, OnDestroy, Input } from '@angular/core';

import { Subscription } from 'rxjs/Subscription';

import { TargetService } from '../target.service';
import { ActorService } from '../actor.service';
import { StateService } from '../state.service';

@Component({
    selector: 'hs-actor',
    template: '',
    styles: []
})
export class ActorComponent implements OnInit, OnDestroy {
    
    @Input('actor') actor:any = {
        id: Math.round(Math.random()*99999),
        type: 'unknown',
        name: 'unknown',
        stats: null,
        rules: null,
        effect: null
    }
    
    isValidActor: boolean = false;
    isTargeted: boolean = false;
    isValidTarget: boolean = false;
    isTargeting: boolean = false;
    
    zIndex: number = 0;
    
    validTargetSub: Subscription;
    validActorSub: Subscription;
    actionSub: Subscription;
    hsEventSub: Subscription;
    
 
    constructor(protected _targetService: TargetService, protected _actorService: ActorService, protected _stateService: StateService) { }

    ngOnInit() {
        this.subscribeValidTarget();
        this.subscribeSelect();   
        this.subscribeIsTargeting();    
    }

    target(event) { 
        this.isValidActor = true; // todo: check this?
        this.isTargeted = true;
        this._targetService.target = this.actor; 
    }

    unTarget() {
        this.isValidActor = false;
        this.isTargeted = false;
        this._targetService.target = false;
        this.isValidTarget = false;
    }
    
    subscribeIsTargeting(){
        this._targetService.hsEvent
        .subscribe(event => { 
            if (event.source && event.source.id === this.actor.id){
                if (event.name === 'startTargeting'){
                    this.zIndex = 10;
                    this.isTargeting = true;
                }
                if (event.name === 'stopTargeting'){
                    this.zIndex = 0;
                    this.isTargeting = false;
                }
            }
        });
    }
    
    // subscribe to all valid objects. Check if name matches. If so, this actor is valid.
    subscribeValidTarget() {
        this.validTargetSub = this._targetService.validTarget
        .subscribe(obj => {
            if (this.isTargeted && obj){
                if (obj.id === this.actor.id){
                    this.isValidTarget = true;
                } 
            }
        });
    }
    
    // Check if a selection is made on a target. If so, send action
    subscribeSelect(){ 
        this._targetService.select
        .subscribe((data: any) => { 
            if (data.target && data.source.id === this.actor.id){ 
                // when a (valid) target is selected, and the source was a card, change cards and mana 
                if (data.source.type === 'card'){
                    this._targetService.hsEvent = { 
                        name: 'spendMana',
                        target: data.target,
                        source: data.source,
                        params: { amount: data.source.stats.manaCost || 0 }
                    };
                    this._targetService.hsEvent = {
                        name: 'cardPlayed',
                        target: data.target,
                        source: data.source
                    }; 
                }
                this._targetService.action = {
                    source: data.source, 
                    target: data.target || this.actor || {}
                };
            }
        });
    }
    
    subscribeAction(subClass: any) { 
        this.actionSub = this._targetService.action
        .subscribe((data: any) => { 
            let effect = this.getActionEffect(data);  
            if (effect){
                subClass.callAction(effect, data.target, data.source);
            }
        });
    }
    
    subscribeHsEvents(subClass: any){
        // default subscriptions:
        let subs: any[] = subClass.DEFAULT_SUBS || [];
        subs = this.getActorHsEventSubs(subs);
        this.hsEventSub = this._targetService.hsEvent
        .subscribe(hsEvent => {  
            subs.map(subscribedEvent => { 
                if (subscribedEvent.to === hsEvent.name){  
                    subscribedEvent = this.getEventParams(subscribedEvent, hsEvent.params); 
                    subClass.callAction(subscribedEvent, hsEvent.target, hsEvent.source);
                }
            })
        });

    }
    
    // check action-event data from subscription and return the effect (or false)
    getActionEffect(data): any | false {
        if (data !== false && data.target && data.target.id === this.actor.id){
            this.isTargeted = false; 
            this.isValidTarget = false; 
            if (data.effect){
                return data.effect;
            } else if (data.source.effect){ 
                return data.source.effect;
            } else {
                return false;
            }
        } 
        return false;
    }
    
    // extend the default subs of an actor with the specific ones for this actor
    getActorHsEventSubs(subs: any[]) {
        if (this.actor.effect && typeof(this.actor.effect.subscribtions)!=='undefined'
            && this.actor.effect.subscribtions.length > 0){
            // add specific subscriptions;
            subs = subs.concat(this.actor.effect.subscribtions);
        }
        return subs;
    }
    
    // extend subscribedEvent object with parameters
    getEventParams(subscribedEvent, params): any {
        subscribedEvent.type = subscribedEvent.call || false;
        if (params){
            subscribedEvent.params = params;
        }
        return subscribedEvent;
    }
    
    ngOnDestroy(){
        this.validTargetSub.unsubscribe();
    }
}
