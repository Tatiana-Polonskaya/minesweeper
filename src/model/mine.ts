import { Point } from "./point";

export interface IMine {
    position: Point;
    isOpened: boolean;
    bombs: number;
    isFlagged: boolean;
}

export class Mine {
    constructor(
        public position: Point,
        public isOpened = false,
        public bombs = 0,
        public isFlagged = false
    ) {}
}

export class Game {
    constructor(
        public squares: Array<Array<Mine>>,
        public totalBombs = 0,
        public exploded = false
    ) {}
}
