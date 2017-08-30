import { Component, Input, OnInit, OnDestroy, Inject, AfterViewInit, ElementRef, ChangeDetectorRef } from '@angular/core';
import { TargetService } from '../shared/target.service';
import { Subscription } from 'rxjs/Subscription';
import { DOCUMENT } from '@angular/platform-browser';

@Component({
    selector: 'hs-target',
    templateUrl: './target.component.html',
    styleUrls: ['./target.component.scss']
})
export class TargetComponent implements OnInit, AfterViewInit, OnDestroy {

    posX: number = 0;
    posY: number = 0;
    marginX: number = 0;    // margin is used to offset the cursor to the mouse-pointer
    marginY: number = 0;
    
    isDragging: boolean = false;
    pointerEvents: string = 'auto';

    targetSub: Subscription;
    targetObj: any;
    validWarning: any = {};
    scrollOnDragStart: number;
    
    @Input('actor') actor: any;
    
    constructor(
        private _targetService: TargetService,
        private _elementRef: ElementRef,
        private _changeDetectorRef: ChangeDetectorRef,
        @Inject(DOCUMENT) private document: Document
    ) { }

    ngOnInit() {
        this.validateTarget();
        this.subscribeToggleTarget();
    }
    
    ngAfterViewInit() {
        setTimeout(()=>{
            this._changeDetectorRef.detectChanges();
        },0);
    }
    
    // track if user is targeting. If so, disable all targets so an actor can be targeted, without the actor's target getting in the way. 
    subscribeToggleTarget(){
        this._targetService.hsEvent
        .subscribe(event => {
            if (event.name === 'startTargeting'){
                this.pointerEvents = 'none';
            }
            if (event.name === 'stopTargeting'){
                this.pointerEvents = 'auto';
            }
        });
    }

    resetCrosshairsPosition() {
        this.posX = 0;
        this.posY = 0;
        this.marginX = 0;
        this.marginY = 0;
    }

    click() {
        if (this.actor.rules.cannotTarget && this.actor.rules.canClick){
            console.log('click!'); 
        }
    }

    // todo: put all drag stuff in directive ?
    dragStart(event) {
        if (!this.actor.rules.cannotTarget){
            if (this.actor.rules.targetAll){
                this._targetService.hsEvent = {
                    name: 'startDragTargetBoard',
                    target: false,
                    source: this.actor
                }
            }
            this._targetService.hsEvent = {
                name: 'startTargeting',
                target: false,
                source: this.actor
            }
            this.calculateCrosshairsMargins(event);
        }
    }
    calculateCrosshairsMargins(event) {
        // calculate margins for crosshairs (to center it around mouse)
        let crosshairsWidth = 40,
            crosshairsHeight = 40; 
        let crosshairsRect = this._elementRef.nativeElement.querySelector('div').getBoundingClientRect();
        this.scrollOnDragStart = this.document.body.scrollTop;
        this.marginX = event.srcEvent.clientX - crosshairsRect.left - (crosshairsWidth/2);
        this.marginY = event.srcEvent.clientY - crosshairsRect.top - (crosshairsWidth/2);
    }
    
    drag(event){
        if (!this.actor.rules.cannotTarget){
            if (!this.isDragging){
                this.isDragging = true;
            } 
            let scrollTop = this.document.body.scrollTop - this.scrollOnDragStart;

            this.posX = event.deltaX + this.marginX;
            this.posY = event.deltaY + this.marginY + scrollTop;
        }
    }

    release(event){
        if (!this.actor.rules.cannotTarget){
            this.resetCrosshairsPosition();   
            this.isDragging = false;  
            if (this._targetService.getTargetValue()!==false){ 
                if (JSON.stringify(this.validWarning) === JSON.stringify({})){ 
                    this._targetService.select = { source: this.actor, target: this.targetObj };
                } else {
                    console.log('Not valid:',this.validWarning.source.name, ':', this.validWarning.msg);
                }
            }
            if (this.actor.rules.targetAll){
                this._targetService.hsEvent = {
                    name: 'stopDragTargetBoard',
                    target: false,
                    source: this.actor
                }
            }
        }
        this._targetService.hsEvent = {
            name: 'stopTargeting',
            target: false,
            source: this.actor
        }
    }    
    
    validateTarget() {
        this.targetSub = this._targetService.target
        .subscribe(target => { 
            if (this.isDragging){
                if (target){ 
                    let validWarnings:any[] = this._targetService.validation(target, this.actor);
                    if (validWarnings.length === 0){
                        // valid object is empty; no warnings
                        this.targetObj = target;  
                        this._targetService.validTarget = target;
                    } else {
                        // invalid target
                        this.validWarning = validWarnings[0];
                        this.targetObj = false;
                    }
                } else {
                    // no minion, etc selected
                    this.targetObj = false;
                    this.validWarning = {}; // empty warning
                }
            }
        });
    }
    
    ngOnDestroy() {
      // unsubscribe to ensure no memory leaks
      if (this.targetSub){
          this.targetSub.unsubscribe();
      }
  }

}
