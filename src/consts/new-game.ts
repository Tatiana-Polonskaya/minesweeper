import { Game } from "../model/game";
import { Mine } from "../model/mine";
import { Point } from "../model/point";

export const BOMBS_PROBABILITY = 0.15;

const dx = [-1, 0, 1, -1, 1, -1, 0, 1];
const dy = [-1, -1, -1, 0, 0, 1, 1, 1];

export function newGame(rows: number, columns: number): Game {
    let totalMines = 0;
    const estimatedMines = Math.floor(rows * columns * BOMBS_PROBABILITY);
    const state = Array(rows)
        .fill(null)
        .map((r, i: number) => {
            return Array(columns)
                .fill(null)
                .map((c, j: number) => {
                    const isMine = Math.random() < BOMBS_PROBABILITY;
                    if (isMine) {
                        totalMines += 1;
                        return {{ x: i, y: j }, false, -1, false};
                    } else {
                        return new Mine({ x: i, y: j }, false, 0, false);
                    }
                });
        });
    while (totalMines < estimatedMines) {
        const randX = Math.floor(Math.random() * rows);
        const randY = Math.floor(Math.random() * columns);
        if (!isMine(state[randX][randY])) {
            ++totalMines;
            state[randX][randY].bombs = -1;
        }
    }
    if (totalMines > estimatedMines) {
        const mines = state
            .map((row) => row.filter((mine) => !isMine(mine)))
            .reduce((prev, current) => prev.concat(current));

        while (totalMines > estimatedMines) {
            const randMineIndex = Math.floor(Math.random() * mines.length);
            mines[randMineIndex].bombs = 0;
            --totalMines;
        }
    }
    fillBombsCount(state);

    return new Game(state, totalMines);
}

export function traverseNeighbours(
    fields: Array<Array<Mine>>,
    startMine: Mine,
    onField: (field: Mine) => Mine
) {
    const inBounds = (point: Point) =>
        point.x >= 0 &&
        point.x < fields.length &&
        point.y >= 0 &&
        point.y < fields[0].length;
    const start = startMine.position;
    dx.map((x, i) => ({ dx: x, dy: dy[i] }))
        .map((deltas) => ({ x: start.x + deltas.dx, y: start.y + deltas.dy }))
        .filter((point: Point) => inBounds(point))
        .map((point: Point) => onField(fields[point.x][point.y]));
    /*for (let i = 0; i < dx.length; ++i) {
        let ii = start.x + dx[i];
        let jj = start.y + dy[i];
        if (ii >= 0 && ii < fields.length && jj >= 0 && jj < fields[0].length) {
            onField(fields[ii][jj]);
        }
    }*/
}

export function update(
    game: Game,
    f: (b: Mine) => Mine,
    exploded = false
): Game {
    const updated = game.state.slice().map((row) => {
        return row.slice().map((field) => {
            return f(field);
        });
    });
    return new Game(updated, game.totalBombs, game.exploded || exploded);
}
function markMine(game: Game, opened: Mine): Game {
    if (opened.isOpened && !opened.isFlagged) return exploreOpenedField(game, opened);
    return update(game, (field: Mine) => {
        if (field == opened) {
            return new Mine(field.position, false, field.bombs, !field.isFlagged);
        } else {
            return new Mine(field.position, field.isOpened, field.bombs, field.isFlagged);
        }
    });
}