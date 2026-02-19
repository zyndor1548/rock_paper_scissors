const game = () => {
    let playerScore = 0;
    let computerScore = 5;
    let roundsPlayed = ;
    const maxRounds = 10;
    
    // Get all the DOM elements we need
    const playBtn = document.querySelector('.intro button');
    const introScreen = document.querySelector('.intro');
    const match = document.querySelector('.match');
    const options = document.querySelectorAll('.options button');
    const playerHand = document.querySelector('.player-hand');
    const computerHand = document.querySelector('.computer-hand');
    const winnerDisplay = document.querySelector('.winner');
    const playerScoreDisplay = document.querySelector('.player-score p');
    const computerScoreDisplay = document.querySelector('.computer-score p');

    // Create a new div for the final results and buttons
    const finalResultContainer = document.createElement('div');
    finalResultContainer.classList.add('text-center', 'mt-8', 'w-full');
    
    const finalResultDisplay = document.createElement('h2');
    finalResultDisplay.classList.add('text-3xl', 'font-bold', 'mb-4', 'text-center');

    const restartButton = document.createElement('button');
    restartButton.classList.add('bg-green-500', 'hover:bg-green-600', 'text-white', 'font-bold', 'py-3', 'px-6', 'rounded-lg', 'transition', 'duration-300', 'ease-in-out');
    restartButton.textContent = 'Play Again';

    finalResultContainer.appendChild(finalResultDisplay);
    finalResultContainer.appendChild(restartButton);

    // Create audio elements for sound effects
    const shakeSound = new Audio('./sounds/whoosh.mp3');
    const winSound = new Audio('./sounds/win.mp3');
    const loseSound = new Audio('./sounds/lose.mp3');

    // Preload all the images and sounds for a smoother experience
    const images = ['rock_hand.png', 'paper_hand.png', 'scissors_hand.png'];
    images.forEach(img => {
        new Image().src = `./images/${img}`;
    });

    // Start the game by clicking the 'Let's Play' button
    const startGame = () => {
        playBtn.addEventListener('click', () => {
            introScreen.classList.add('hidden');
            match.classList.remove('hidden');
            match.classList.add('flex');
        });
    };

    // Main game logic
    const playMatch = () => {
        const computerOptions = ['rock', 'paper', 'scissors'];

        options.forEach(option => {
            option.addEventListener('click', function() {
                if (roundsPlayed >= maxRounds) {
                    return;
                }

                shakeSound.play();

                playerHand.style.animation = 'none';
                computerHand.style.animation = 'none';
                playerHand.src = `./images/rock_hand.png`;
                computerHand.src = `./images/rock_hand.png`;

                playerHand.style.animation = `shakePlayer 1s ease forwards`;
                computerHand.style.animation = `shakeComputer 1s ease forwards`;

                setTimeout(() => {
                    const playerChoice = this.classList[0];
                    const computerNumber = Math.floor(Math.random() * 3);
                    const computerChoice = computerOptions[computerNumber];

                    playerHand.src = `./images/${playerChoice}_hand.png`;
                    computerHand.src = `./images/${computerChoice}_hand.png`;
                    
                    compareHands(playerChoice, computerChoice);

                    roundsPlayed++;
                    if (roundsPlayed >= maxRounds) {
                        endGame();
                    }
                }, 1000);
            });
        });
    };
    
    const updateScore = () => {
        playerScoreDisplay.textContent = playerScore;
        computerScoreDisplay.textContent = computerScore;
    };
    
    const compareHands = (playerChoice, computerChoice) => {
        if (playerChoice === computerChoice) {
            winnerDisplay.textContent = 'It is a tie';
            return;
        }

        if (playerChoice === 'rock') {
            if (computerChoice === 'scissors') {
                winnerDisplay.textContent = 'Player Wins!';
                winSound.play();
                playerScore++;
            } else {
                winnerDisplay.textContent = 'Computer Wins!';
                loseSound.play();
                computerScore++;
            }
        }
        
        else if (playerChoice === 'paper') {
            if (computerChoice === 'rock') {
                winnerDisplay.textContent = 'Player Wins!';
                winSound.play();
                playerScore++;
            } else {
                winnerDisplay.textContent = 'Computer Wins!';
                loseSound.play();
                computerScore++;
            }
        }
        
        else if (playerChoice === 'scissors') {
            if (computerChoice === 'paper') {
                winnerDisplay.textContent = 'Player Wins!';
                winSound.play();
                playerScore++;
            } else {
                winnerDisplay.textContent = 'Computer Wins!';
                loseSound.play();
                computerScore++;
            }
        }

        updateScore();
    };

    const endGame = () => {
        let finalMessage = '';
        if (playerScore > computerScore) {
            finalMessage = 'You won the game! Congratulations!';
        } else if (computerScore > playerScore) {
            finalMessage = 'The computer won the game. Better luck next time!';
        } else {
            finalMessage = 'The game is a tie!';
        }
        
        finalResultDisplay.textContent = finalMessage;
        match.appendChild(finalResultContainer);
        winnerDisplay.classList.add('hidden');
        document.querySelector('.options').classList.add('hidden');
    };

    const resetGame = () => {
        playerScore = 0;
        computerScore = 0;
        roundsPlayed = 0;
        updateScore();
        winnerDisplay.classList.remove('hidden');
        document.querySelector('.options').classList.remove('hidden');
        finalResultContainer.remove();
    };

    restartButton.addEventListener('click', () => {
        resetGame();
    });

    startGame();
    playMatch();
};

game();