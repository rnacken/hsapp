
import { Injectable }   from '@angular/core';
import { Observable }   from 'rxjs';
import { Subject }      from 'rxjs/Subject';
//import { BehaviorSubject }      from 'rxjs/BehaviorSubject';
import { Subscription } from 'rxjs/Subscription';

type ActorType = any | boolean | Observable<any>;

@Injectable()
export class ActorService {

    myMana: number = 0;
    myManaMax: number = 0;
    
    myHero: any = {
        id: 0, 
        name: 'Jaina', 
        type: 'hero',
        stats: {
            hp: 30,
            hpMax: 30,
            attack: 0,
            attackMax: 0,
            isEnemy: false
        },
        rules: {
            cannotTarget: false, 
            cannotTargetJohn: false,
            canTargetSelf: false  
        },
        effect: {
            subscribtions: [
                {  to: 'minionHealed', call: 'damageAllMinions', amount: 1 },
                {  to: 'minionHealed', call: 'sayThanksOrCrap' },
                
            ] 
        }
    };
    // todo : make interface for heroPower/minion/etc
    myHeroPower: any = {
        id: 1,
        name: 'healing',
        type: 'hero power',
        stats: {},
        rules: {
            cannotTarget: false,    // true for example hunter, warlock
            cannotTargetJohn: true,
            canTargetSelf: false
        },
        effect: {
            type: 'heal',
            amount: 2,
        }   
    };
    
    enemyHero: any = {
        id: 2, 
        name: 'Rexar', 
        type: 'hero',
        stats: {
            hp: 30,
            hpMax: 30,
            attack: 0,
            attackMax: 0,
            isEnemy: true
        },
        rules: {
            cannotTarget: true, 
            cannotTargetJohn: false,
            canTargetSelf: false  
        },
        effect: {
            type: 'damage',
            amount: 1
        }
    };
    
    myMinions: any[] = [];
//    {   
//        id: 10000, 
//        name: 'John', 
//        type: 'minion',
//        stats: {
//            hp: 3,
//            hpMax: 4,
//            attack: 2,
//            attackMax: 2,
//            isEnemy: false
//        },
//        rules: {
//            cannotTarget: false, 
//            cannotTargetJohn: false,
//            canTargetSelf: true  
//        },
//        effect: {
//            subscribtions: [
//                {  to: 'minionDeath', call: 'sayThanksOrCrap' },                
//            ] 
//        }
//    },
//    { 
//        id: 10001, 
//        name: 'Karen', 
//        type: 'minion',
//        stats: {
//            hp: 2,
//            hpMax: 5,
//            attack: 3,
//            attackMax: 3,
//            isEnemy: false,
//            //isFrozen: true,
//            isFire: true
//        },
//        rules: {
//              
//        },
//        effect: {}
//    },
//    ];
//    
    enemyMinions: any[] = [];
//       { 
//        id: 20000, 
//        name: 'Cereal', 
//        type: 'minion',
//        stats: {
//            hp: 4,
//            hpMax: 4,
//            attack: 1,
//            attackMax: 1,
//            isEnemy: true
//        },
//        rules: {
//            cannotTarget: false, 
//            cannotTargetJohn: false
//        },
//        effect: {
//            
//        }
//    } 
//    ];
    
    myCards: any[] = [
        {
            id: 50000,
            type: 'card',
            subType: 'minion',
            stats: {
                cardName: 'recruit',
                manaCost: 1,
                image: 'http://www.gravatar.com/avatar/4418cc6fe4650318f2957f52c0495b1a?s=50&d=retro'
            },
            rules: {
                cannotTargetMinion: true,
                cannotTargetHero: true,
                canTargetSpace: true
            },
            effect: {
                type: 'playMinion',
                minionId: 99
            }
        },
        {
            id: 50001,
            type: 'card',
            subType: 'minion',
            stats: {
                cardName: 'blob',
                manaCost: 4,
                image: 'http://www.gravatar.com/avatar/1418cd6fe4650318f2957f52c0495b1a?s=50&d=retro'
            },
            rules: {
                cannotTargetMinion: true,
                cannotTargetHero: true,
                canTargetSpace: true
            },
            effect: {
                type: 'playMinion',
                minionId: 98
            }
        },
        {
            id: 50002,
            type: 'card',
            subType: 'spell',
            stats: {
                cardName: 'incr',
                manaCost: 2,
                image: 'http://www.gravatar.com/avatar/4418cc6bb4650318f2957f52bb495b1a?s=50&d=retro'
            },
            rules: {
                cannotTargetHero: true,
                cannotTargetEnemy: true,
            },
            effect: {
                type: 'addDamageAndHealth',
                props: {
                    amount: 1
                }
            }
        },
        {
            id: 50003,
            type: 'card',
            subType: 'spell',
            stats: {
                cardName: 'blast',
                manaCost: 3,
                image: 'http://www.gravatar.com/avatar/4aaacc6fe4650318f29aaf52c0495b1a?s=50&d=retro'
            },
            rules: {
                targetAll: true
            },
            effect: {
                type: 'blastHero',
                props: {
                    amount: 5
                }
            }
            
        }
    ];
    myCardsInHand: any[] = [];

    
    enemyCardsAmount: number = 4;   // todo: like this?

    minions: any[] = [
        
        {   
            id: 99, 
            name: 'Recruit', 
            type: 'minion',
            stats: {
                hp: 1,
                hpMax: 1,
                attack: 1,
                attackMax: 1
            },
            rules: {
            },
            effect: {
                subscribtions: [
                    {  to: 'minionDeath', call: 'sayThanksOrCrap' },                
                ] 
            }
        },
        {   
            id: 98, 
            name: 'Blob', 
            type: 'minion',
            stats: {
                hp: 2,
                hpMax: 2,
                attack: 1,
                attackMax: 1
            },
            rules: {
            },
            effect: {
            }
        },
    ]

}
