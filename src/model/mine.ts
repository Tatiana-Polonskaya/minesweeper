import { Point } from "./point";

export interface Mine {
    position: Point;
    isOpened: boolean;
    bombs: number;
    isFlagged: boolean;
}
