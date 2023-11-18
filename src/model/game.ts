import { Mine } from "./mine";

export interface IGame {
    squares: Array<Array<Mine>>,
    totalBombs: number,
    exploded: boolean,
}