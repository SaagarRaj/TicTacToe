import { useState, useEffect } from "react";
import Board from "./Board";
import GameOver from "./GameOver";
import GameState from "./GameState";
import Reset from "./Reset";
import ClickSound from "../Sounds/Click_sound.wav";
import GameOverSound from "../Sounds/Game_over.wav";
import confetti from "canvas-confetti";
require("canvas-confetti");

const ClickSoundAsset = new Audio(ClickSound);
ClickSoundAsset.volume = 0.2;
const GameOverSoundAsset = new Audio(GameOverSound);
GameOverSoundAsset.volume = 0.5;

const PLAYER_X = "X";
const PLAYER_O = "O";

const winningCombinations = [
  //rows
  { combo: [0, 1, 2], strikeClass: "strike-row-1" },
  { combo: [3, 4, 5], strikeClass: "strike-row-2" },
  { combo: [6, 7, 8], strikeClass: "strike-row-3" },
  //columns
  { combo: [0, 3, 6], strikeClass: "strike-column-1" },
  { combo: [1, 4, 7], strikeClass: "strike-column-2" },
  { combo: [2, 5, 8], strikeClass: "strike-column-3" },
  //diagonal
  { combo: [0, 4, 8], strikeClass: "strike-diagonal-1" },
  { combo: [2, 4, 6], strikeClass: "strike-diagonal-2" },
];

function checkWinner(tiles, setStrikeClass, setGameState) {
  for (const { combo, strikeClass } of winningCombinations) {
    const tileValue1 = tiles[combo[0]];
    const tileValue2 = tiles[combo[1]];
    const tileValue3 = tiles[combo[2]];

    if (
      tileValue1 !== null &&
      tileValue1 === tileValue2 &&
      tileValue1 === tileValue3
    ) {
      setStrikeClass(strikeClass);

      if (tileValue1 === PLAYER_X) {
        setGameState(GameState.playerXwins);
        confetti();
      } else {
        setGameState(GameState.playerOwins);
      }
      return;
    }
  }

  const CheckAllTilesFilled = tiles.every((tiles) => tiles != null);
  if (CheckAllTilesFilled) {
    setGameState(GameState.draw);
  }
}
function TicTacToe() {
  const [tiles, setTiles] = useState(Array(9).fill(null));
  const [playerTurn, setPlayerTurn] = useState(PLAYER_X);
  const [strikeClass, setStrikeClass] = useState();
  const [gameState, setGameState] = useState(GameState.inprogress);

  const handleTileClick = (index) => {
    if (gameState !== GameState.inprogress) {
      return;
    }
    if (tiles[index] !== null) {
      return;
    }
    const newTile = [...tiles];
    newTile[index] = playerTurn;
    setTiles(newTile);
    if (playerTurn === PLAYER_X) {
      setPlayerTurn(PLAYER_O);
    } else {
      setPlayerTurn(PLAYER_X);
    }
    ClickSoundAsset.play();
  };
  const HandleReset = () => {
    setGameState(GameState.inprogress);
    setTiles(Array(9).fill(null));
    setPlayerTurn(PLAYER_X);
    setStrikeClass(null);
  };
  useEffect(() => {
    checkWinner(tiles, setStrikeClass, setGameState);
  }, [tiles]);

  useEffect(() => {
    if (GameState !== gameState.inprogress) {
      GameOverSoundAsset.play();
    }
  }, [gameState]);
  return (
    <div className="board-card">
      <h1>TicTacToe</h1>
      <Board
        playerTurn={playerTurn}
        tiles={tiles}
        OnTileClick={handleTileClick}
        strikeClass={strikeClass}
      />
      <GameOver gameState={gameState} />
      <Reset gameState={gameState} onReset={HandleReset} />
    </div>
  );
}

export default TicTacToe;
