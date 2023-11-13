import { Point } from "./point";

export interface Mine {
    position: Point;
    isOpened: false;
    bombs: 0;
    isFlagged: false;
}
