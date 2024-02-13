import { Point } from "./point";

export class Mine {
    constructor(
        public position: Point,
        public isOpened = false,
        public bombs = 0,
        public isFlagged = false
    ) {}
}


