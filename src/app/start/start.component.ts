import { Component } from '@angular/core';
import { GameService } from '../game/game.service';

@Component({
  selector: 'app-start',
  templateUrl: './start.component.html',
  styleUrls: ['./start.component.scss']
})
export class StartComponent {

  constructor(private gameService: GameService){}

  gameStarted: boolean = false;
  levelChosen: boolean = false;
  level: number = 0;

  public startGame(): void{
    this.gameStarted = true;
  }

  public chooseLevel(level: number): void {
    this.levelChosen = true;
    this.level = level;
  }

}
