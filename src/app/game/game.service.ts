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

  // Fill the board with 0 values in every cell
  private startEmptyArray(): number[][]{
    let emptyBoard = [];
    for(let i = 0; i < 9 ; i++){
      emptyBoard.push(Array(9).fill(0));
    }
    return emptyBoard;
  }

  public initializeBoard(level: number): number[][]{
    this.resetBoard();
    
    // obtain the amount of position filled using the level
    switch(level){
      case 1:
          this.amountPositionsFilled = 45;
          break;
      case 2:
          this.amountPositionsFilled = 35;
          break;
      case 3:
          this.amountPositionsFilled = 25;
          break;
      case 4:
        this.amountPositionsFilled = 20;
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
  } 

  private isValidPlacement(row: number, col: number, num: number): boolean {
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
    while(this.positionsFilled.length < this.amountPositionsFilled){
      let line = Math.floor(Math.random()*9);
      let column = Math.floor(Math.random()*9);
      
      if(!this.positionsFilled.some(pos => pos[0] == line && pos[1] == column)){
        this.positionsFilled.push([line, column]);
      }
    }
  }

  // Fill the public board getting the values randomly chosen to be disabled in the solution board 
  private getNumbers(): void{
    for(let position of this.positionsFilled){
      this.board[position[0]][position[1]] = this.completedBoard[position[0]][position[1]]
    }
  }

  // Check the row to se if there are equal numbers in it.
  private checkRow(value: number, row: number): boolean {
    // return false if there is an equal number in that line
    // return true if there is not
    
    if(this.completedBoard[row].includes(value)){
      return false;
    }
    return true;
  }
  // Check the column to se if there are equal numbers in it.
  private checkColumn(value: number, column: number): boolean {
    // return false if there is an equal number in that column
    // return true if there is not
    for(let i=0; i<9; i++){
      if(this.completedBoard[i][column] == value){
        return false;
      }
    }
    return true;
  }
  // Check the quadrant to se if there are equal numbers in it.
  private checkQuadrant (value: number, row: number, column: number): boolean{
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
  // Check if the board is completed and has no number 0's.
  private checkBoard(): boolean{
    return !this.completedBoard.some(row => row.includes(0));
    
  }
  
  // Create a list of position that will be disabled so the board has some numbers already filled in.
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

  giveTips(): number[]{
    let solution = [];
    while(solution.length == 0){
      let line = Math.floor(Math.random()*9);
      let column = Math.floor(Math.random()*9);
      
      if(!this.positionsFilled.some(pos => pos[0] == line && pos[1] == column)){
        this.positionsFilled.push([line, column]);
        solution.push(line);
        solution.push(column);
        solution.push(this.completedBoard[line][column])
      }
    }
    return solution;
  }

  // Called when the board is completed, check if the board matches with the solution created 
  checkGame(board: number[][]){
    for(let i = 0; i < 9; i++){
      for(let j = 0; j < 9; j++){
        if(this.completedBoard[i][j] != board[i][j]){
          alert("Ops! There is something wrong. Try again!");
          return;
        }
      }
    }
    alert("Yay, you got it!");
  }

  getWrongValues(board: number[][]): number[][]{
    let response = [];
    for(let i = 0; i < 9; i++){
      for(let j = 0; j < 9; j++){
        if(board[i][j] != 0 && this.completedBoard[i][j] != board[i][j] ){
          response.push([i, j]);
        }
      }
    }
    return response;
  }
}
