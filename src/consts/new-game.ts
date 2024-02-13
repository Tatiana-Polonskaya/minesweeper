import { Game } from "../@types/game";
import { Mine } from "../@types/mine";
import { Point } from "../@types/point";

export const BOMBS_PROBABILITY = 0.15;

const dx = [-1, 0, 1, -1, 1, -1, 0, 1];
const dy = [-1, -1, -1, 0, 0, 1, 1, 1];

export function newGame(rows: number, columns: number): Game {
    // инициализация игры

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
                        return new Mine({ x: i, y: j }, false, -1, false);
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
            .map((row) => row.filter((mine) => isMine(mine)))
            .reduce((prev, current) => prev.concat(current));

        while (totalMines > estimatedMines) {
            const randMineIndex = Math.floor(Math.random() * mines.length);
            mines[randMineIndex].bombs = 0;
            --totalMines;
        }
    }

    fillBombsCount(state); // считает количество бомб вокруг клетки

    return new Game(state, totalMines);
}

function isMine(mine: Mine) {
    return mine.bombs === -1;
}

export function fillBombsCount(state: Array<Array<Mine>>) {
    state.forEach((row) => {
        row.forEach((mine) => {
            if (isMine(mine)) {
                mine.bombs = -1;
                traverseNeighbours(state, mine, (nf) => {
                    if (!isMine(nf)) {
                        nf.bombs += 1;
                    }
                    return nf;
                });
            }
        });
    });
}

// вспомогательная функция для итерации восьми соседей клетки
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

// обновление состояния игры
export function update(
    game: Game,
    f: (b: Mine) => Mine,
    exploded = false
): Game {
    const updated = game.squares.slice().map((row) => {
        return row.slice().map((field) => {
            return f(field);
        });
    });
    return new Game(updated, game.totalBombs, game.exploded || exploded);
}

// разметить минное поле
export function markMine(game: Game, opened: Mine): Game {
    if (opened.isOpened && !opened.isFlagged)
        return exploreOpenedField(game, opened);
    return update(game, (field: Mine) => {
        if (field == opened) {
            return new Mine(
                field.position,
                false,
                field.bombs,
                !field.isFlagged
            );
        } else {
            return new Mine(
                field.position,
                field.isOpened,
                field.bombs,
                field.isFlagged
            );
        }
    });
}

//Исследует открытое поле
function exploreOpenedField(game: Game, opened: Mine): Game {
    const updated = update(game, (field: Mine) => field);
    let hitMine = false;
    traverseNeighbours(updated.squares, opened, (field) => {
        if (!field.isOpened && !field.isFlagged) {
            if (field.bombs === -1) {
                hitMine = true;
            } else {
                field.isOpened = true;
                if (field.bombs == 0) {
                    updateZeros(updated.squares, field);
                }
            }
        }
        return field;
    });
    if (hitMine) {
        return endGame(game);
    }
    return updated;
}

function endGame(game: Game): Game {
    return update(
        game,
        (field) => {
            if (field.bombs === -1) {
                return new Mine(
                    field.position,
                    true,
                    field.bombs,
                    field.isFlagged
                );
            } else {
                return new Mine(
                    field.position,
                    field.isOpened,
                    field.bombs,
                    field.isFlagged
                );
            }
        },
        true
    );
}

export function openMine(game: Game, field: Mine): Game {
    if (field.isFlagged) return game;
    else if (isMine(field)) {
        return endGame(game);
    } else {
        const openField = (openedField: Mine) => (field: Mine) => {
            if (field === openedField) {
                return new Mine(field.position, true, field.bombs, false);
            } else {
                return new Mine(
                    field.position,
                    field.isOpened,
                    field.bombs,
                    field.isFlagged
                );
            }
        };
        const result = update(game, openField(field));
        if (field.bombs == 0) {
            updateZeros(result.squares, field);
        }
        return result;
    }
}

function updateZeros(fields: Array<Array<Mine>>, start: Mine) {
    traverseNeighbours(fields, start, (field) => {
        if (!field.isOpened && field.bombs !== -1) {
            field.isOpened = true;
            if (field.bombs == 0) {
                updateZeros(fields, field);
            }
        }
        return field;
    });
}

export function checkCompleted(game: Game): boolean {
    const and = (a: boolean, b: boolean) => a && b;
    return game.squares
        .map((row) => {
            return row
                .map((field) => {
                    return isMineCovered(field);
                })
                .reduce(and);
        })
        .reduce(and);
}

function isMineCovered(field: Mine) {
    if (field.bombs === -1) {
        return field.isFlagged;
    } else {
        return field.isOpened;
    }
}

export function countFlagged(game: Game): number {
    const plus = (a: number, b: number) => a + b;
    return game.squares
        .map((row) => {
            return row
                .map((field) => {
                    return field.isFlagged ? 1 : 0;
                })
                .reduce(plus, 0);
        })
        .reduce(plus, 0);
}
