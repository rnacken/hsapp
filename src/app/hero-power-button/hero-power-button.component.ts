import { Component, OnInit, Input } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';

import { ActorComponent } from '../shared/actor/actor.component';


@Component({
    selector: 'hs-hero-power-button',
    templateUrl: './hero-power-button.component.html',
    styleUrls: ['./hero-power-button.component.scss']
})
export class HeroPowerButtonComponent extends ActorComponent implements OnInit {
    
    heroPowerUsed: boolean = false;
    
    @Input('actor') actor:any;
    heroPower: any;
    
    DEFAULT_SUBS: any = [
    ];
    
    ngOnInit(){
        this.heroPower = this.actor; // for template
        super.ngOnInit();
        super.subscribeAction(this);
        super.subscribeHsEvents(this);
    }
    
    callAction(effect, target, source){
        switch (effect.type) {
        }
    }
}
