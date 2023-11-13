import { Mine } from "./mine";

export interface Game {
    squares: Array<Array<Mine>>,
    totalBombs: number,
    exploded: boolean,
}