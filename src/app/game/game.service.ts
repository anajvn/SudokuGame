import { Injectable, OnInit } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class GameService{

  private board : number[][] = [];
  private completedBoard : number[][] = [];
  private positionsFilled: number[][] = [];
  private amountPositionsFilled: number = 0;

  private resetBoard():void{
    this.positionsFilled = [];
    this.amountPositionsFilled = 0;
    this.completedBoard = this.startEmptyArray();
    this.board = this.startEmptyArray();
  }

  private startEmptyArray(): number[][]{
    let emptyBoard = [];
    for(let i = 0; i < 9 ; i++){
      emptyBoard.push(Array(9).fill(0));
    }
    return emptyBoard;
  }

  public initializeBoard(level: number): number[][]{
    this.resetBoard();
    console.log(this.completedBoard);

    // obtain the amount of position filled using the level
    switch(level){
      case 1:
          this.amountPositionsFilled = 38;
          break;
      case 2:
          this.amountPositionsFilled = 30;
          break;
      case 3:
          this.amountPositionsFilled = 25;
          break;
    }

    // create positions
    this.createPositionsFilled();
    
    // fill board
    if(this.fillBoard(0,0)){
      this.getNumbers();
    }
    
    return this.board;
  }

  private fillBoard(row: number, col: number): boolean{ 
    if(row == 9){
      return true;
    }

    let nextRow = col === 8 ? row + 1 : row;
    let nextCol = col === 8 ? 0 : col + 1;
    let values = [1, 2, 3, 4, 5, 6, 7, 8, 9];

    // Try filling the current cell with a random number
    values.sort(() => Math.random() - 0.5);
    for (let num of values) {
      if (this.isValidPlacement(row, col, num)) {
        this.completedBoard[row][col] = num;
        if (this.fillBoard(nextRow, nextCol)) {
          return true;
        }
        // If filling this number doesn't lead to a solution, backtrack
        this.completedBoard[row][col] = 0;
      }
    }
    return false;
    // let values = [1, 2, 3, 4, 5, 6, 7, 8, 9];
    // let row = 0;
    // let column = 0;
      
    // for(let position = 0; position < 81; position++){
    //   row = Math.floor(position / 9);
    //   column = position % 9;
      
    //   console.log(this.completedBoard);

    //   // Check if the position isn't already filled
    //   if(this.completedBoard[row][column] == 0){
    //     values.sort(() => Math.random() - 0.5);
    //     for(let value of values){
    //       // Check if the value has not been used on the row
    //       if(this.checkRow(value, row)){

    //         // Check if the value has not been used on the column
    //         if(this.checkColumn(value, column)){

    //           // Check if the value has not been used on the quadrant
    //           if(this.checkQuadrant(value, row, column)){
    //             this.completedBoard[row][column] = value;
    //             if(!this.checkBoard()){
    //               if(this.fillBoard()){
    //                 return true;
    //               }
    //             }
    //           }
    //         }
    //       }
    //     }
    //     break;
    //   }
    // }
    // this.completedBoard[row][column] = 0;
    // return false;
    
    // console.log(this.completedBoard);

    
    // for(let i=0; i<9; i++){
    //   for(let j=0; j<9; j++){
    //     this.completedBoard[i][j] = (i * 3 + Math.floor(i / 3) + j) % 9 + 1;
          
        
    //     // let value = Math.floor(Math.random() * 9) + 1;
    //     // if(this.checkLine(value, i) && this.checkColumn(value, j) && this.checkSquare(value, i, j)){
    //       // this.completedBoard[i][j] = value;
    //       // console.log(value)
    //     // } else{
    //     //   j--;
    //     // }  
    //   }
    // }
    // console.log(this.completedBoard)
    // // this.positionsToFill.forEach(position =>{
    // //   this.board[position[0]][position[1]] = this.completedBoard[position[0]][position[1]];
    // // })

    // console.log(this.board);

    // for(let i=0; i<this.amountPositionsFilled; i++){
    //   let value = Math.floor(Math.random() * 9) + 1;
    //   let line = this.positionsToFill[i][0];
    //   let column = this.positionsToFill[i][1];

    //   if(this.checkLine(value, line) && this.checkColumn(value, column) && this.checkSquare(value, line, column)){
    //     this.board[line][column] = value;
    //   } else{
    //     i--;
    //   }
    // }
  } 

  isValidPlacement(row: number, col: number, num: number): boolean {
    // Check row and column
    for (let i = 0; i < 9; i++) {
      if (this.completedBoard[row][i] === num || this.completedBoard[i][col] === num) {
        return false;
      }
    }
    // Check 3x3 square
    let startRow = Math.floor(row / 3) * 3;
    let startCol = Math.floor(col / 3) * 3;
    for (let i = startRow; i < startRow + 3; i++) {
      for (let j = startCol; j < startCol + 3; j++) {
        if (this.completedBoard[i][j] === num) {
          return false;
        }
      }
    }
    return true;
  }

  private createPositionsFilled():void{
    //while(this.positionsFilled.length < 79){
    while(this.positionsFilled.length < this.amountPositionsFilled){
      let line = Math.floor(Math.random()*9);
      let column = Math.floor(Math.random()*9);
      
      if(!this.positionsFilled.some(pos => pos[0] == line && pos[1] == column)){
        this.positionsFilled.push([line, column]);
      }
    }
  }

  getNumbers(): void{
    for(let position of this.positionsFilled){
      this.board[position[0]][position[1]] = this.completedBoard[position[0]][position[1]]
    }
  }

  
  checkRow(value: number, row: number): boolean {
    // return false if there is an equal number in that line
    // return true if there is not
    
    if(this.completedBoard[row].includes(value)){
      return false;
    }
    return true;
  }
  checkColumn(value: number, column: number): boolean {
    // return false if there is an equal number in that column
    // return true if there is not
    for(let i=0; i<9; i++){
      if(this.completedBoard[i][column] == value){
        return false;
      }
    }
    return true;
  }
  checkQuadrant (value: number, row: number, column: number): boolean{
    let i = row < 3 ? 0 : (row < 6 ? 3 : 6);
    let j = column < 3 ? 0 : (column < 6 ? 3 : 6);

    // return false if there is an equal number in the square
    // return true if there is not
    
    for(let k=i; k<(i+3); k++){
        for(let l=j; l<(j+3); l++){
            if(this.completedBoard[k][l]==value){
                return false;
            }
        } 
    }
    return true;
  }

  // Check if the board is completed
  checkBoard(): boolean{
    return !this.completedBoard.some(row => row.includes(0));
    
  }


  getDisabled(): boolean[][]{
    let disabled: boolean [][] = [];
    for (let i = 0; i< this.board.length; i++){
      disabled[i] = [];
      for (let j = 0; j < this.board[i].length; j++){
        disabled[i].push(this.board[i][j] != 0);
      }
    }
    return disabled; 
  }

  checkGame(board: number[][]){
    for(let i = 0; i < 9; i++){
      for(let j = 0; j < 9; j++){
        if(this.completedBoard[i][j] != board[i][j]){
          alert("Not Finished");
          return;
        }
      }
    }
    alert("Finished");
  }
}
