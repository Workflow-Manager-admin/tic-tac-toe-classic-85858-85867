import React, { useState, useEffect } from "react";
import "./App.css";

/**
 * Tic Tac Toe - Player vs Player Minimalistic App
 * - 3x3 board, status area, controls for new/restart, minimal UI.
 * - Theme: light, primary #1976D2, secondary #424242, accent #FFD600
 */

// Helper component for rendering the game square
// PUBLIC_INTERFACE
function Square({ value, onClick, accent }) {
  return (
    <button
      className="ttt-square"
      onClick={onClick}
      aria-label={value ? `Cell occupied by ${value}` : "Empty board cell"}
      style={value === "X" || value === "O" ? { color: accent } : {}}
      tabIndex={0}
    >
      {value}
    </button>
  );
}

// PUBLIC_INTERFACE
function GameStatus({ status }) {
  return <div className="ttt-status">{status}</div>;
}

// PUBLIC_INTERFACE
function GameControls({ onNewGame, onRestart, isFirstMove }) {
  return (
    <div className="ttt-controls">
      <button className="ttt-btn ttt-btn-primary" onClick={onNewGame} aria-label="Start New Game">
        New Game
      </button>
      <button
        className="ttt-btn ttt-btn-secondary"
        onClick={onRestart}
        disabled={isFirstMove}
        aria-label="Restart Current Game"
      >
        Restart
      </button>
    </div>
  );
}

// Calculate winner or draw
function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],[3, 4, 5],[6, 7, 8], // rows
    [0, 3, 6],[1, 4, 7],[2, 5, 8], // cols
    [0, 4, 8],[2, 4, 6], // diags
  ];
  for (const [a, b, c] of lines) {
    if (
      squares[a] &&
      squares[a] === squares[b] &&
      squares[a] === squares[c]
    ) {
      return squares[a];
    }
  }
  if (squares.every((v) => v)) return "Draw";
  return null;
}

// PUBLIC_INTERFACE
function App() {
  // THEME: Only light mode, but set css variables as needed for branding
  useEffect(() => {
    document.documentElement.style.setProperty("--primary", "#1976D2");
    document.documentElement.style.setProperty("--secondary", "#424242");
    document.documentElement.style.setProperty("--accent", "#FFD600");
    document.documentElement.style.setProperty("--bg-main", "#fff");
    document.documentElement.style.setProperty("--text-main", "#282c34");
  }, []);

  // Game state
  const [squares, setSquares] = useState(Array(9).fill(null));
  const [xIsNext, setXIsNext] = useState(true); // If true, X's turn; O otherwise
  const [gameActive, setGameActive] = useState(false);

  // Computed
  const winner = calculateWinner(squares);
  const isFirstMove = squares.every((s) => s === null);
  let status;

  if (!gameActive || isFirstMove) {
    status = "Press New Game to start.";
  } else if (winner && winner !== "Draw") {
    status = `Winner: ${winner === "X" ? "Player 1 (X)" : "Player 2 (O)"} 🎉`;
  } else if (winner === "Draw") {
    status = "It's a draw! 🤝";
  } else {
    status = `Next: ${xIsNext ? "Player 1 (X)" : "Player 2 (O)"}`;
  }

  // Handlers
  // PUBLIC_INTERFACE
  function handleClick(i) {
    if (!gameActive || winner || squares[i]) return;
    const nextSquares = squares.slice();
    nextSquares[i] = xIsNext ? "X" : "O";
    setSquares(nextSquares);
    setXIsNext(!xIsNext);
  }

  // PUBLIC_INTERFACE
  function handleNewGame() {
    setSquares(Array(9).fill(null));
    setXIsNext(true);
    setGameActive(true);
  }

  // PUBLIC_INTERFACE
  function handleRestart() {
    setSquares(Array(9).fill(null));
    setXIsNext(true);
    // keep gameActive as true
  }

  // Board render
  function renderBoard() {
    return (
      <div className="ttt-board">
        {Array(3)
          .fill(null)
          .map((_, rowIdx) => (
            <div className="ttt-row" key={rowIdx}>
              {Array(3)
                .fill(null)
                .map((_, colIdx) => {
                  const idx = rowIdx * 3 + colIdx;
                  return (
                    <Square
                      key={idx}
                      value={squares[idx]}
                      onClick={() => handleClick(idx)}
                      accent={
                        squares[idx] === "X"
                          ? "var(--primary)"
                          : squares[idx] === "O"
                          ? "var(--secondary)"
                          : "inherit"
                      }
                    />
                  );
                })}
            </div>
          ))}
      </div>
    );
  }

  return (
    <div className="ttt-app shell-minimal">
      <h1 className="ttt-title">Tic Tac Toe Classic</h1>
      <GameControls onNewGame={handleNewGame} onRestart={handleRestart} isFirstMove={isFirstMove} />
      <div className="ttt-ctr-board">{renderBoard()}</div>
      <GameStatus status={status} />
      <footer className="ttt-footer">
        <span className="credit">
          <span style={{ color: "var(--primary)", fontWeight: 700 }}>Player 1 (X)</span>
          {" "}vs{" "}
          <span style={{ color: "var(--secondary)", fontWeight: 700 }}>Player 2 (O)</span>
          {" "}· Minimalist UI ·
        </span>
      </footer>
    </div>
  );
}

export default App;
