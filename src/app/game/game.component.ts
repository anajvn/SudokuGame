import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { GameService } from './game.service';

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.scss']
})
export class GameComponent implements OnInit{

  @Input()
  level: number = 0;

  initialBoard: number[][] = [];
  board: number[][] = [];
  disablesPosition: boolean[][] = [];
  gameEnded: boolean = false;
  correctGame: boolean = false;

  constructor(private gameService: GameService){}

  ngOnInit(): void {
    this.initializeBoard();
  }

  initializeBoard():void{
    this.initialBoard = this.gameService.initializeBoard(this.level);
    this.board = this.initialBoard;
    this.disablesPosition = this.gameService.getDisabled();
  }

  updateBoardValue(value: any, rowIndex: number, colIndex: number) {
    this.board[rowIndex][colIndex] = value != '' ? parseInt(value, 10) : 0;
  }
  
  isComplete(): boolean{
    for(let row of this.board){
      if(row.includes(0)){
        return false;
      }
    }
    return true;
  }

  checkGame(): void{
    if(this.isComplete()){
      this.gameService.checkGame(this.board);
    }
  }

  saveBoard(row: number, col: number, input:number):void{
    this.board[row][col] == input;
  }

  resetGame(): void{
    this.board = this.initialBoard;
  }

  newGame(): void{
    this.gameEnded = false;
    this.correctGame = false;

    this.initializeBoard();
  }

  changeLevel(newLevel: number): void{
    this.level = Number(newLevel);
    this.initializeBoard();
  }
}
