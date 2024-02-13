import { Mine } from "./mine";

export class Game {
    constructor(
        public squares: Array<Array<Mine>>,
        public totalBombs = 0,
        public exploded = false
    ) {}
}
