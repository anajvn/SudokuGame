import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-board-header',
  templateUrl: './board-header.component.html',
  styleUrls: ['./board-header.component.scss']
})
export class BoardHeaderComponent implements OnInit {

  timer: number = 0;
  isTimerDisabled: boolean = true;
  
  @Input()
  currentLevel: number = 0;

  @Output()
  resetGame: EventEmitter<boolean> = new EventEmitter(false);

  @Output()
  changeGame: EventEmitter<boolean> = new EventEmitter(false);

  @Output()
  changeLevel: EventEmitter<number> = new EventEmitter();
  
  @Output()
  tips: EventEmitter<boolean> = new EventEmitter(false);

  @Output()
  hideBoard: EventEmitter<boolean> = new EventEmitter(false);

  ngOnInit(): void {
    this.isTimerDisabled = false;
    this.startTimer();
  }

  startTimer() {
    setInterval(() => {
      if(!this.isTimerDisabled){
        this.timer++;
      }
    }, 1000); // atualiza o timer a cada segundo
  }

  pauseTimer(){
    this.isTimerDisabled = !this.isTimerDisabled;
    this.hideBoard.emit(true);
  }

  reset(): void{
    this.resetGame.emit(true);
  }

  newGame(): void{
    this.changeGame.emit(true);
  }

  newLevel(): void{
    this.timer = 0;
    this.changeLevel.emit(this.currentLevel);
  }

  giveTips():void{
    this.tips.emit(true);
  }
  
}
