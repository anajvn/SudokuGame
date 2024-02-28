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
  disabledPositions: boolean[][] = [];
  gameEnded: boolean = false;
  correctGame: boolean = false;
  tipsGiven: number = 0;
  boardHidden: boolean = false;
  checkErrors: boolean = false;

  wrongValues: number[][] = [];

  constructor(private gameService: GameService){}

  ngOnInit(): void {
    this.initializeBoard();
  }

  initializeBoard():void{
    this.initialBoard = this.gameService.initializeBoard(this.level);
    this.board = this.initialBoard;
    this.disabledPositions = this.gameService.getDisabled();
  }

  updateBoardValue(value: any, rowIndex: number, colIndex: number) {
    this.board[rowIndex][colIndex] = value != '' ? parseInt(value, 10) : 0;

    this.wrongValues = this.gameService.getWrongValues(this.board);
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

  resetGame(): void{
    for(let i = 0; i< this.board.length; i++){
      for(let j = 0; j < this.board[i].length; j++){
        if(!this.disabledPositions[i][j]){
          this.board[i][j] = 0;
        }
      }
    }
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

  giveTips():void{
    if(this.tipsGiven < 3){
      let tips = this.gameService.giveTips();
      this.board[tips[0]][tips[1]] = tips[2];
      this.tipsGiven ++;
    } else {
      alert('You can only use 3 tips.')
    }
  }

  hideBoard():void{
    this.boardHidden = !this.boardHidden;
  }

  quadrantDelimitation(position:number):boolean{
    return position == 3 || position == 0 || position == 6
  }

  isWrong(rowIndex: number, colIndex:number): boolean{
    if(this.checkErrors){
      if(this.wrongValues.some(pos => pos[0] == rowIndex && pos[1] == colIndex )){
        return true;
      }
    }
    return false;
  }
}
