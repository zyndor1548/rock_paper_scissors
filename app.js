const game = () => {
    let playerScore = 0;
    let computerScore = 0;
    let roundsPlayed = 0; // fixed
    const maxRounds = 10;

    // DOM elements
    const playBtn = document.querySelector('.intro button');
    const introScreen = document.querySelector('.intro');
    const match = document.querySelector('.match');
    const options = document.querySelectorAll('.options button');
    const playerHand = document.querySelector('.player-hand');
    const computerHand = document.querySelector('.computer-hand');
    const winnerDisplay = document.querySelector('.winner');
    const playerScoreDisplay = document.querySelector('.player-score p');
    const computerScoreDisplay = document.querySelector('.computer-score p');

    // Final results container
    const finalResultContainer = document.createElement('div');
    finalResultContainer.classList.add('text-center', 'mt-8', 'w-full');

    const finalResultDisplay = document.createElement('h2');
    finalResultDisplay.classList.add('text-3xl', 'font-bold', 'mb-4', 'text-center');

    const restartButton = document.createElement('button');
    restartButton.classList.add('bg-green-500', 'hover:bg-green-600', 'text-white', 'font-bold', 'py-3', 'px-6', 'rounded-lg', 'transition', 'duration-300', 'ease-in-out');
    restartButton.textContent = 'Play Again';

    finalResultContainer.appendChild(finalResultDisplay);
    finalResultContainer.appendChild(restartButton);

    // Sounds
    const shakeSound = new Audio('./sounds/whoosh.mp3');
    const winSound = new Audio('./sounds/win.mp3');
    const loseSound = new Audio('./sounds/lose.mp3');

    // Preload default images
    ['rock_hand.png', 'paper_hand.png', 'scissors_hand.png'].forEach(
        img => (new Image().src = `./images/${img}`)
    );

    // -------------------------------------------------------
    // Selected images per move type (player's custom choices)
    // -------------------------------------------------------
    const selectedImages = {
        rock: './images/rock_hand.png',
        paper: './images/paper_hand.png',
        scissors: './images/scissors_hand.png'
    };

    // Pending (uncommitted) selection while the picker is open
    const pendingImages = { ...selectedImages };

    // --- Image Picker wiring ---
    const pickerModal = document.getElementById('image-picker-modal');
    const openPickerBtn = document.getElementById('open-image-picker');
    const closePickerBtn = document.getElementById('close-image-picker');
    const confirmPickerBtn = document.getElementById('confirm-image-picker');
    const pickerImgs = document.querySelectorAll('.picker-img');

    /** Highlight whichever image is currently pending for each type */
    const refreshPickerHighlight = () => {
        pickerImgs.forEach(img => {
            const selected = img.dataset.src === pendingImages[img.dataset.type];
            img.classList.toggle('border-sky-500', selected);
            img.classList.toggle('border-transparent', !selected);
            img.classList.toggle('scale-105', selected);
        });
    };

    openPickerBtn.addEventListener('click', () => {
        Object.assign(pendingImages, selectedImages); // sync to committed state
        refreshPickerHighlight();
        pickerModal.classList.remove('hidden');
    });

    const closeModal = () => pickerModal.classList.add('hidden');

    closePickerBtn.addEventListener('click', closeModal);

    // Close when clicking the backdrop
    pickerModal.addEventListener('click', e => {
        if (e.target === pickerModal) closeModal();
    });

    // Clicking an image marks it as pending
    pickerImgs.forEach(img => {
        img.addEventListener('click', () => {
            pendingImages[img.dataset.type] = img.dataset.src;
            refreshPickerHighlight();
        });
    });

    // Confirm button: commit pending choices and close
    confirmPickerBtn.addEventListener('click', () => {
        Object.assign(selectedImages, pendingImages);
        // Immediately show the new rock image on the game board
        playerHand.src = selectedImages.rock;
        computerHand.src = selectedImages.rock;
        closeModal();
    });

    // Start game
    playBtn.addEventListener('click', () => {
        introScreen.classList.add('hidden');
        match.classList.remove('hidden');
        match.classList.add('flex');
    });

    // Play match
    const playMatch = () => {
        const computerOptions = ['rock', 'paper', 'scissors'];

        options.forEach(option => {
            option.addEventListener('click', function() {
                if (roundsPlayed >= maxRounds) return;

                shakeSound.play();

                // Reset animations
                playerHand.style.animation = 'none';
                computerHand.style.animation = 'none';
                void playerHand.offsetWidth; // force reflow
                void computerHand.offsetWidth;

                // Start shaking animation
                playerHand.style.animation = 'shakePlayer 1s ease forwards';
                computerHand.style.animation = 'shakeComputer 1s ease forwards';

                setTimeout(() => {
                    const playerChoice = this.classList[0];
                    const computerChoice = computerOptions[Math.floor(Math.random() * 3)];

                    // Player uses their custom image; computer uses the default set
                    playerHand.src = selectedImages[playerChoice];
                    computerHand.src = selectedImages[computerChoice];

                    compareHands(playerChoice, computerChoice);

                    roundsPlayed++;
                    if (roundsPlayed >= maxRounds) endGame();
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

        const wins = {
            rock: 'scissors',
            paper: 'rock',
            scissors: 'paper'
        };

        if (wins[playerChoice] === computerChoice) {
            winnerDisplay.textContent = 'Player Wins!';
            winSound.play();
            playerScore++;
        } else {
            winnerDisplay.textContent = 'Computer Wins!';
            loseSound.play();
            computerScore++;
        }

        updateScore();
    };

    const endGame = () => {
        let finalMessage = '';
        if (playerScore > computerScore) finalMessage = 'You won the game! 🎉';
        else if (computerScore > playerScore) finalMessage = 'Computer won the game. 😢';
        else finalMessage = 'The game is a tie! 🤝';

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
        if (finalResultContainer.parentNode)
            finalResultContainer.parentNode.removeChild(finalResultContainer);
        playerHand.src = selectedImages.rock;
        computerHand.src = selectedImages.rock;
    };

    restartButton.addEventListener('click', resetGame);

    playMatch();
};

game();