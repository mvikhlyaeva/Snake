import { Direction } from '@angular/cdk/bidi';
import { Component, OnInit } from '@angular/core';
import { interval, timer, of, from } from 'rxjs';
import { tap, map, reduce, scan, take, takeWhile } from 'rxjs/operators';
import { DirectionType } from '../enums/direction.enum';
import { StateType } from '../enums/states.enum';
import {MatDialog} from '@angular/material/dialog';
import { ModalComponent } from '../modal/modal.component';



@Component({
    selector: 'app-area',
    templateUrl: './area.component.html',
    styleUrls: ['./area.component.scss']
})
export class AreaComponent implements OnInit {

    areaArr: number[];
    curr: number;
    direction: DirectionType;
    n = 10;
    newCurr: number;
    time: number = 500;
    subscribe: any;
    state: StateType = StateType.notPlay;
    store: number = 0;

    constructor(public dialog: MatDialog) { }

    ngOnInit(): void {
        this.areaArr = Array(this.n * this.n).fill(0);
    }

    start() {
        if (this.state != StateType.pause){
            this.init(this.n * this.n);
            this.store = 0;
        }
        this.state = StateType.isPlaying;
        const source = interval(this.time)
            .pipe(
                takeWhile(v => this.state == StateType.isPlaying),
                tap(v => {
                    if (!this.checkValid()){
                        this.state = StateType.gameOver;
                        this.openModal();
                        return;
                    }
                    if (this.areaArr[this.newCurr] > 0) {
                        this.state = StateType.gameOver;
                        this.openModal();
                        return;
                    }
                    else {
                        if (this.areaArr[this.newCurr] < 0) {
                            this.addNewFood();
                            this.store +=1;
                        }
                        else this.areaArr = this.areaArr.map(x => x > 0 ? x - 1 : x);

                    }
                    this.areaArr[this.newCurr] = this.areaArr[this.curr] + 1;
                    this.curr = this.newCurr;
                })
            );
        this.subscribe = source.subscribe();
    }

    onchangeState(){
        if (this.state == StateType.isPlaying){
            this.state = StateType.pause;
        }
        else {
            this.start();
        }
    }

    openModal(){
        const dialogRef = this.dialog.open(ModalComponent, {
            width: '7000px',
            data: {
                store: this.store
            },
        });
    }

    init(max) {
        this.areaArr.fill(0);
        this.curr = Math.floor(Math.random() * max);
        this.areaArr[this.curr] = 1;
        this.areaArr[Math.floor(Math.random() * max)] = -1;
        do {
            this.direction = Math.floor(Math.random() * 4);

        } while (!this.checkValid());
    }

    checkValid(){
        switch (this.direction) {
            case DirectionType.Up:
                if (this.curr < this.n) {
                    return false;
                }
                this.newCurr = this.curr - this.n;
                break;
            case DirectionType.Down:
                if (this.curr + this.n >= this.n * this.n) {
                    return false;
                }
                this.newCurr = this.curr + this.n;
                break;
            case DirectionType.Right:
                if (this.curr % this.n == this.n - 1) {
                    return false;
                }
                this.newCurr = this.curr + 1;
                break;
            case DirectionType.Left:
                if (this.curr % this.n == 0) {
                    return false;
                }
                this.newCurr = this.curr - 1;
                break;
        }
        return true;
    }

    getBackgroundColor(i) {
        if (i > 0) return "#545f97";
        else if (i < 0) return "green";
        else return "rgb(47 48 60)";
    }

    addNewFood() {
        let newFood
        do {
            newFood = Math.floor(Math.random() * (this.n * this.n));
        } while (this.areaArr[newFood] != 0);
        this.areaArr[newFood] = -1;
    }

    up() {
        this.direction = DirectionType.Up;
        console.log("qwr");
    }

    down() {
        this.direction = DirectionType.Down;
    }

    right() {
        this.direction = DirectionType.Right;
    }

    left() {
        this.direction = DirectionType.Left;
    }


}
