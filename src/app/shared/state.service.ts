import { Injectable } from '@angular/core';
import { AngularFireDatabase, FirebaseListObservable } from 'angularfire2/database';
import { AngularFireAuth } from 'angularfire2/auth';
import * as firebase from 'firebase/app';
import { Observable, Subscription }   from 'rxjs';

import { TargetService } from './target.service';


@Injectable()
export class StateService {

    user$: Observable<firebase.User>;
    players$: FirebaseListObservable<any[]>;
    games$: FirebaseListObservable<any[]>;
    
    hsEventSub: Subscription;
    hsEvents$: FirebaseListObservable<any[]>;

    username: string = '';

    players: any[];
    games: any[];
    authState: any = null;
    uid: string = null;
    
    myGame: any = null;
    myPlayer: any = null;
    myEnemy: any = null;
    myTurn: boolean = false;
    
    register: boolean = false;
    gameStarted: boolean = false;

    challengeTimeout: any;

    updateTimeout: number = 60;//6000000;   

    
    constructor(public _afAuth: AngularFireAuth, public _af: AngularFireDatabase, protected _targetService: TargetService) {
    
        this.players$ = _af.list('/players', {
            query: {
                limitToLast: 50
            }
        });
        this.games$ = _af.list('/games', {
            query: {
                limitToLast: 25
            }
        });
        this.hsEvents$ = _af.list('/events', {
            query: {
                limitToLast: 50
            }
        });
        this.user$ = this._afAuth.authState;
    }
    
    init(){
        // check login/logout changes;
        this._afAuth.auth.onAuthStateChanged((_user: any) => {
            if (_user) {
                // User is signed in.   
                console.log('auth state'); 
                this.uid = _user.uid;
                this.subscribeStreams();
                
                if (this.register){
                    this.addPlayer(_user);
                    this.register = false;
                } 
                
                
            } else {
                // Not signed in.
            }
        });
        
        
        //this.subscribeSendHsEvents();
    }
    
    subscribeStreams(){
        // check players-updates;
        this.players$.subscribe((players)=>{
            console.log('subscribed to players');
            this.players = players;
            // delete idle players
            this.removeIdlePlayers(players);
            this.removeIdleGames();

            // get myPlayer
            if (this.uid){
                this.myPlayer = this.myPlayer || players.find((player) => player.uid === this.uid);  
                console.log('myplayer:',this.myPlayer);  
                if (!this.myPlayer){
                    // player no longer in db
                    console.log(' player no longer in db');
                    this.logout(null);  
                } 
            } else {
                console.log('no uid set yet');
            }     
        });
        
        // check if a game is started / still running (in case of refresh)
        this.games$.subscribe((games)=>{
            console.log('subscribed to games');
            this.games = games;
            
            // find current game;
            this.myGame = games.find((game) => game.player1.uid === this.uid || game.player2.uid === this.uid);
                        
            if (this.myGame){
                this.restoreGame();
                this.myEnemy = (this.myGame.player1.uid === this.uid)? this.myGame.player2 : this.myGame.player1;
                let myTurnOld = this.myTurn;
                this.myTurn = ((this.myGame.turn === 'player1' 
                    && this.myGame.player1.uid === this.myPlayer.uid)
                    || (this.myGame.turn === 'player2' 
                        && this.myGame.player2.uid === this.myPlayer.uid));
                
                        // todo: fix this - do endturn with normal way
                if (myTurnOld !== this.myTurn){
                    // the turn has changed;
                    this._targetService.hsEvent = {
                        name: 'turnEnded',
                        target: false,
                        source: false,
                        params: {
                            player: this.myGame[this.myGame.turn]
                        }
                    }
                }
            }
        });
    }
    
    registerAndLogin(name: string) {
        this.username = name;
        this.register = true;
        this._afAuth.auth.signInAnonymously();
    }

    logout(player: any) {
        console.log('logging out');
        this._afAuth.auth.signOut();
        this.username = '';
        this.uid = null;
        if (player) { this.removePlayer(player); }
    }
    
    addPlayer(user: any) {
        // check for username already existing and not this uid;
        if (this.register){ 
            let existingPlayer = this.players.find(
                (player)=> player.name.toLowerCase().trim() === this.username.toLowerCase().trim()
                && player.uid !== user.uid);
            let currentTimestamp = + new Date();
            let newPlayer:any = { name: this.username, uid: user.uid, created: currentTimestamp, updated: currentTimestamp };
            
            if (existingPlayer){
                // logout & remove player
                if (existingPlayer.updated + (this.updateTimeout) < currentTimestamp){
                    // existing user is timed out; overwrite
                    newPlayer.$key = this.players$.push(newPlayer).key;
                    this.removePlayer(existingPlayer);
                    // todo: send event to logout existing player
                } else {
                    console.log('username already taken', existingPlayer);
                    this.logout(this.myPlayer);
                }
            } else {
                newPlayer.$key = this.players$.push(newPlayer).key;
            }   
            this.myPlayer = newPlayer;
        }
    }
    removePlayer(player: any): void{
        // removing player:
        this._af.object('/players/'+player.$key).remove();
        // check if this.uid mathces deleted player. if so, logout.
        let deletedPlayer = this.players.find((player) => player.uid === this.uid);
        if (deletedPlayer){
            console.log('player is deleted; logout');
            this.players = this.players.filter((player) => player.uid !== this.uid);
            this.logout(false);
        }
        this.myPlayer = null;
        if (this.games){
            // remove game if player is removed -> auto-win for other user.
            let game = this.games.find((game) => game.player1.uid===this.uid || game.player2.uid===this.uid);
            if (game){ console.log('removing game', game); 
                this._af.object('/games/'+game.$key).remove();
            }
        }
    }
    
    // check if players are idle for longer than x time; remove them.
    removeIdlePlayers(players: any): void{
        console.log('checking idle players');
        let currentTimestamp = + new Date();
        for(let player of players){
            let date = new Date(player.updated);
            console.log('checking player', player.name, date, new Date());
            if ((!player.updated)
                || (player.updated + (this.updateTimeout*1000) < currentTimestamp )){
                if (player.uid !== this.uid){
                    // current player is deleted - todo: show msg
                }
                this.removePlayer(player);
                // todo: send event to logout existing player
            }            
        }
    }
    
    removeIdleGames(): void {
        let currentTimestamp = + new Date();
        if (this.games){
            for(let game of this.games){
                if ((!game.updated)
                    || (game.updated + (this.updateTimeout*1000) < currentTimestamp )){
                    this._af.object('/games/'+game.$key).remove();
                }            
            }
        }
    }
    
    challenge(player: any): void{
        if (this.challengeTimeout){
            clearTimeout(this.challengeTimeout.data.handleId);
        }
        // check if user is accepting challenge, or starting one;
        if (player.challenging && player.challenging === this.myPlayer.$key){
            // accept
            this._af.object('/players/'+player.$key).update({challenging: false, updated: + new Date()});
            console.log('start game!',player.name,'vs',this.myPlayer.name);
            this.startGame(player);
        } else {
            // start
            this._af.object('/players/'+this.myPlayer.$key).update({challenging: player.$key, updated: + new Date()})
                .then(()=>{
                    this.myPlayer.challenging = player.$key;
                    let challengedPlayerKey = this.myPlayer.challenging;
                    this.challengeTimeout = setTimeout(()=>{
                        if (challengedPlayerKey === this.myPlayer.challenging){
                            this._af.object('/players/'+this.myPlayer.$key).update({challenging: false, updated: + new Date()});
                            this.myPlayer.challenging = false;

                        }
                    }, 5000);
                });
        }   
    }

    startGame(player: any): void{
        this.gameStarted = true;
        this._af.object('/players/'+this.myPlayer.$key)
            .update({updated: + new Date()});
        let coinToss = Math.round(Math.random() * 1);
        this.myGame = this.games$.push({
            player1: (coinToss===0)? this.myPlayer : player,
            player2: (coinToss===0)? player : this.myPlayer,
            created: + new Date(),
            updated: + new Date(),
            turn: 'player1',
            turnTimestamp: + new Date()
        });
        this.myEnemy = player;
    }
    
    restoreGame(){
        this.gameStarted = true;
        this._af.object('/players/'+this.myPlayer.$key).update({updated: + new Date()});
        //this._af.object('/games/'+this.myGame.$key).update({updated: + new Date()});
    }

    endTurn(){
        this._af.object('/games/'+this.myGame.$key).update({
            turn: (this.myGame.turn === 'player1')? 'player2' : 'player1',
            updated: + new Date()
        });
    }
    
    // listen to all hsEvents from; send them to firebase
    subscribeSendHsEvents(){
        // send the hsEvent to firebase
        this.hsEventSub = this._targetService.hsEvent
        .subscribe((hsEvent: any) => { 
            console.log('sending event to other side:', hsEvent.name);
            this.hsEvents$.push({
                hsEvent: hsEvent,
                gameKey: this.myGame.$key,
                senderUid: this.myPlayer.uid
            })
        });
        // listen to firebase hsEvent
        this.hsEvents$.subscribe((hsEvents: any[]) => {
            hsEvents.map((hsEvent)=>{
            if (hsEvent.gameKey === this.myGame.$key
                && hsEvent.senderUid === this.myEnemy.uid){
                console.log('picked up event from other side:', hsEvent.hsEvent.name);
                // this event came from our opponent in our game; set it in our local env
                //this._targetService.hsEvent = hsEvent.hsEvent;
                // hsEvent from server reached the local site; it can be removed
                //this._af.object('/hsEvents/'+hsEvent.$key).remove();
            }
            })
            
        })
    }
}
