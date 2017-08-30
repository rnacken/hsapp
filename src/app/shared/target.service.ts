import { Injectable }   from '@angular/core';
import { Observable }   from 'rxjs';
import { Subject }      from 'rxjs/Subject';
import { BehaviorSubject }      from 'rxjs/BehaviorSubject';

import { Subscription } from 'rxjs/Subscription';
import { StateService } from './state.service';


type TargetType = any | boolean | Observable<any>;

@Injectable()
export class TargetService {

    // todo: make type of targetObject
    private target$ = new BehaviorSubject<any>(false);
    private validTarget$ = new BehaviorSubject<any>(false);
    private select$ = new Subject<any>();
    private action$ = new Subject<any>();
    private hsEvent$ = new Subject<any>();

    //constructor(private _stateService: StateService) { }

    // on targeting
    public set target(_obj: TargetType) {
      let obj = <any|boolean> _obj;  
      this.target$.next(obj);
    }
    public get target(): TargetType {
      let result = <Observable<any>> this.target$.asObservable();
      return result;
    }
    public getTargetValue(){
        return this.target$.value;
    }
    
    // after checking validity
    public set validTarget(_obj: TargetType){
        let obj = <any> _obj;  
        this.validTarget$.next(obj);
    }
    public get validTarget(): TargetType {
        let result = <Observable<any>> this.validTarget$.asObservable();
        return result;
    }
    
    // after targeting, validating and release:
    public set select(_obj: TargetType){ 
        let obj = <any> _obj;  
        this.select$.next(obj);
    }
    public get select(): TargetType {
        let result = <Observable<any>> this.select$.asObservable();
        return result;
    }
    
    // after targeting, validating and release:
    public set action(data: any){  
        this.action$.next(data);
        // send to firebase
    }
    public get action(): any {
        return this.action$.asObservable();
    }
    
    // 
    public set hsEvent(data: any){
        this.hsEvent$.next(data);
        // send to firebase
        //this._stateService.setHsEvent(data);
    }
    public get hsEvent(): any {
        return this.hsEvent$.asObservable();
    }
    
    // todo: make targetProps type model instead of any
    validation(target: any, source: any): any[] {
        let validWarnings: any[] = this.defaultRuleValidation(target, source);
        
        if (!source.rules){ return validWarnings; }   // check if there are specific rules
        
        Object.keys(source.rules).forEach((rule:string) => {
            // exclusive rules
            if (source.rules[rule] !== false){
                
                switch(rule){
                    case 'cannotTargetHero': 
                        if (target.type === 'hero'){
                            validWarnings.push({ 
                                rule: rule,
                                target: target,
                                source: source,
                                msg: 'You may not target heroes' 
                            });
                        }
                        break;
                    case 'cannotTargetMinion':
                        if (target.type === 'minion'){
                            validWarnings.push({ 
                                rule: rule,
                                target: target,
                                source: source,
                                msg: 'You may not target minions' 
                            });
                        }
                        break;
                    case 'cannotTargetJohn':
                        if (target.name === 'John'){
                            validWarnings.push({ 
                                rule: rule,
                                target: target,
                                source: source,
                                msg: 'You may not target John' 
                            });
                        }
                        break;
                    case 'cannotTargetEnemy': 
                        if ((target.type==='hero' || target.type==='minion') && target.stats && target.stats.isEnemy === true){
                            validWarnings.push({ 
                                rule: rule,
                                target: target,
                                source: source,
                                msg: 'You may not target enemies' 
                            });
                        }
                        break;
                    
                }  
            }
            // inclusive rules (remove other rule-warnings)
            if (source.rules[rule] === true){
                switch(rule){
                    case 'targetAll': 
                        validWarnings = [];     // any place on the minions-board will do
                        if (target.type === 'hero'){
                            validWarnings.push({ 
                                rule: rule,
                                target: target,
                                source: source,
                                msg: 'You may not target heroes' 
                            });
                        }
                        break;
                    case 'canTargetSelf':
                        validWarnings = this.removeRule(validWarnings, 'cannotTargetSelf');
                        break;
                    case 'canTargetSpace': 
                        validWarnings = this.removeRule(validWarnings, 'cannotTargetSpace');
                        break;
                }
            }
        });
        
        return validWarnings;  
    }
    
    removeRule(validWarnings: any[], rule:string): any[] {
        return validWarnings.filter((warning)=>{
            return warning.rule !== rule;
        });
    }
    
    defaultRuleValidation(target: any, source: any){
        let validWarnings: any[] = [];
        const defaultRules = [
            'cannotTargetSelf',
            'cannotTargetSpace', 
            'cannotTargetHeroPower',
            'taunt'
        ];
        
        for (let rule of defaultRules){
            switch (rule){
                case 'cannotTargetSelf':    // cancel with 'canTargetSelf:true'
                    if (target.id === source.id){
                        validWarnings.push({ 
                            rule: rule,
                            target: target,
                            source: source,
                            msg: `A ${source.type} can not target itself`
                        });
                    }
                    break;
                case 'cannotTargetSpace':
                    if (target.type === 'minion space'){ 
                        validWarnings.push({ 
                            rule: rule,
                            target: target,
                            source: source,
                            msg: `You must select a valid target`
                        });
                    }
                case 'cannotTargetHeroPower':
                    if (target.type === 'hero power'){ 
                        validWarnings.push({ 
                            rule: rule,
                            target: target,
                            source: source,
                            msg: `You must select a valid target`
                        });
                    }
                case 'taunt':
                    break;
            }
        }
        return validWarnings;
    }

}
