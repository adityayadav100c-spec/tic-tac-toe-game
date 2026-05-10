document.addEventListener('DOMContentLoaded', () => {
    const boardElement = document.getElementById('board');
    const cells = document.querySelectorAll('.cell');
    const statusMessage = document.getElementById('status-message');
    const resetBtn = document.getElementById('reset-btn');
    const clearScoresBtn = document.getElementById('clear-scores-btn');
    const winOverlay = document.getElementById('win-overlay');
    const winnerText = document.getElementById('winner-text');
    const playAgainBtn = document.getElementById('play-again-btn');
    
    const scoreXElement = document.getElementById('score-x');
    const scoreOElement = document.getElementById('score-o');
    const playerXCard = document.getElementById('player-x');
    const playerOCard = document.getElementById('player-o');

    let currentPlayer = 'X';
    let gameState = ["", "", "", "", "", "", "", "", ""];
    let gameActive = true;
    let scores = { X: 0, O: 0 };

    const winningConditions = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6]
    ];

    function handleCellClick(e) {
        const clickedCell = e.target;
        const clickedCellIndex = parseInt(clickedCell.getAttribute('data-index'));

        if (gameState[clickedCellIndex] !== "" || !gameActive) {
            return;
        }

        handleCellPlayed(clickedCell, clickedCellIndex);
        handleResultValidation();
    }

    function handleCellPlayed(clickedCell, clickedCellIndex) {
        gameState[clickedCellIndex] = currentPlayer;
        clickedCell.textContent = currentPlayer;
        clickedCell.classList.add(currentPlayer.toLowerCase());
        
        // Add a little pop animation
        clickedCell.style.transform = 'scale(0.9)';
        setTimeout(() => {
            clickedCell.style.transform = 'scale(1)';
        }, 100);
    }

    function handlePlayerChange() {
        currentPlayer = currentPlayer === "X" ? "O" : "X";
        statusMessage.textContent = `Your turn, Player ${currentPlayer}`;
        
        // Update active player card
        if (currentPlayer === 'X') {
            playerXCard.classList.add('active');
            playerOCard.classList.remove('active');
        } else {
            playerOCard.classList.add('active');
            playerXCard.classList.remove('active');
        }
    }

    function handleResultValidation() {
        let roundWon = false;
        let winningLine = null;

        for (let i = 0; i <= 7; i++) {
            const winCondition = winningConditions[i];
            let a = gameState[winCondition[0]];
            let b = gameState[winCondition[1]];
            let c = gameState[winCondition[2]];
            if (a === '' || b === '' || c === '') {
                continue;
            }
            if (a === b && b === c) {
                roundWon = true;
                winningLine = winCondition;
                break;
            }
        }

        if (roundWon) {
            handleGameOver(false, winningLine);
            return;
        }

        let roundDraw = !gameState.includes("");
        if (roundDraw) {
            handleGameOver(true);
            return;
        }

        handlePlayerChange();
    }

    function handleGameOver(isDraw, winningLine = null) {
        gameActive = false;
        
        if (isDraw) {
            winnerText.textContent = "It's a Draw!";
            statusMessage.textContent = "Game Draw!";
        } else {
            winnerText.textContent = `Player ${currentPlayer} Wins!`;
            statusMessage.textContent = `Player ${currentPlayer} won the round!`;
            scores[currentPlayer]++;
            updateScores();
            
            // Highlight winning cells
            winningLine.forEach(index => {
                cells[index].classList.add('win');
            });
        }

        setTimeout(() => {
            winOverlay.classList.remove('hidden');
        }, 600);
    }

    function updateScores() {
        scoreXElement.textContent = scores.X;
        scoreOElement.textContent = scores.O;
    }

    function handleRestartGame() {
        gameActive = true;
        currentPlayer = "X";
        gameState = ["", "", "", "", "", "", "", "", ""];
        statusMessage.textContent = `Your turn, Player X`;
        
        playerXCard.classList.add('active');
        playerOCard.classList.remove('active');
        
        cells.forEach(cell => {
            cell.textContent = "";
            cell.classList.remove('x', 'o', 'win');
        });
        
        winOverlay.classList.add('hidden');
    }

    function handleClearScores() {
        scores = { X: 0, O: 0 };
        updateScores();
        handleRestartGame();
    }

    // Event Listeners
    cells.forEach(cell => cell.addEventListener('click', handleCellClick));
    resetBtn.addEventListener('click', handleRestartGame);
    clearScoresBtn.addEventListener('click', handleClearScores);
    playAgainBtn.addEventListener('click', handleRestartGame);
});
