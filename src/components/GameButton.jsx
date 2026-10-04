function GameButton({ texto, onClick }) {
  return (
    <button className="game-button" onClick={onClick}>
      {texto}
    </button>
  )
}

export default GameButton