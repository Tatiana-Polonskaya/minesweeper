import { useEffect, useState } from "react";
import {
    checkCompleted,
    countFlagged,
    markMine,
    newGame,
    openMine,
} from "../../consts/new-game";
import Button from "../button";
import { MineField } from "../mine-field";
import { Timer } from "../timer";
import { Mine } from "../../@types/mine";
import { Game } from "../../@types/game";
import "./style.scss";

function App() {
    const [controlDown, setControlDown] = useState(false);

    const [timer, setTimer] = useState<number>();

    let startTime: Date;

    const [state, setState] = useState({
        rows: 8, //this.props.rows
        columns: 8, //this.props.columns
        game: newGame(8, 8),
        completed: false,
        flagged: 0,
        elapsedSeconds: 0,
    });

    const isControlKey = (code: string) => {
        return code === "ControlLeft" || code === "ControlRight";
    };

    const startTimer = () => {
        startTime = new Date();
        setTimer(
            setInterval(() => {
                const now = new Date();
                const elapsedMs = now.getTime() - startTime.getTime();
                setState((prev) => {
                    return {
                        ...prev,
                        elapsedSeconds: Math.floor(elapsedMs / 1000),
                    };
                });
            }, 1000)
        );
    };

    const updateState = (
        field: Mine,
        updateFn: (game: Game, field: Mine) => Game
    ) => {
        setState((prev) => {
            const updatedGame = updateFn(prev.game, field);
            const completed = checkCompleted(updatedGame);
            if (completed || updatedGame.exploded) {
                clearInterval(timer);
            }
            return {
                ...prev,
                game: updatedGame,
                completed: completed,
                flagged: countFlagged(updatedGame),
            };
        });
    };

    const onSquareLeftClick = (field: Mine) => {
        if (controlDown) {
            updateState(field, openMine);
        } else {
            updateState(field, markMine);
        }
    };

    const startGame = (rows: number, columns: number) => {
        clearInterval(timer);
        startTimer();
        setState({
            rows: rows,
            columns: columns,
            game: newGame(rows, columns),
            completed: false,
            flagged: 0,
            elapsedSeconds: 0,
        });
    };

    useEffect(() => {
        document.onkeydown = (e: KeyboardEvent) => {
            if (isControlKey(e.code)) {
                setControlDown(true);
            }
        };
        document.onkeyup = (e: KeyboardEvent) => {
            if (isControlKey(e.code)) {
                setControlDown(false);
            }
        };
        startTimer();
    }, []);

    return (
        <div className="main-page">
            <header className="header">
                <h1 className="title">New Minesweeper</h1>
                <div className="panel">
                    <Button onClick={() => startGame(6, 8)}>Easy</Button>
                    <Button onClick={() => startGame(10, 14)}>Medium</Button>
                    <Button onClick={() => startGame(20, 30)}>Hard</Button>
                </div>
            </header>

            <MineField
                game={state.game}
                onLeftClick={(field: Mine) => onSquareLeftClick(field)}
            />
            <Timer elapsedSeconds={state.elapsedSeconds} />
            <div className="status">
                Completed: {state.completed ? "YES" : "NO"}
            </div>
            <div className="status">
                {state.flagged}/{state.game.totalBombs}
            </div>
            <div className="help">
                <h3>How to play</h3>
                <ol>
                    <li>
                        Left Click to mark possible mine or to explore fields
                        around opened field
                    </li>
                    <li>Ctrl + Left Click to open field</li>
                </ol>
            </div>
        </div>
    );
}

export default App;
