// Moduł obsługujący interfejs użytkownika
import { getGameState, setSelectedCard } from './gameState.js';
import { drawCardForPlayer, playCard, endTurn, startVoting, initGame } from './gameLogic.js';

// Elementy DOM
const player1Hand = document.getElementById('player1-hand');
const player2Hand = document.getElementById('player2-hand');
const boardCardsElement = document.getElementById('board-cards');
const turnIndicator = document.getElementById('turn-indicator');
const roundIndicator = document.getElementById('round-indicator');
const gameLog = document.getElementById('game-log');
const playCardButton = document.getElementById('play-card');
const drawCardButton = document.getElementById('draw-card');
const endTurnButton = document.getElementById('end-turn');
const startVotingButton = document.getElementById('start-voting');
const showVotesButton = document.getElementById('show-votes');
const votingModal = document.getElementById('voting-modal');
const closeVotingModal = document.getElementById('close-voting-modal');
const votingResults = document.getElementById('voting-results');
const cardinalsModal = document.getElementById('cardinals-modal');
const closeCardinalsModal = document.getElementById('close-cardinals-modal');
const cardinalDisplay = document.getElementById('cardinal-display');
const gameEndModal = document.getElementById('game-end-modal');
const winnerInfo = document.getElementById('winner-info');
const newGameButton = document.getElementById('new-game');
const politicalCards = document.getElementById('political-cards');
const demonicCards = document.getElementById('demonic-cards');
const spiritualCards = document.getElementById('spiritual-cards');
const mediaCards = document.getElementById('media-cards');
const votingCircle = document.getElementById('voting-circle');

// Inicjalizacja event listenerów
export function initEventListeners() {
    drawCardButton.addEventListener('click', handleDrawCard);
    playCardButton.addEventListener('click', handlePlayCard);
    endTurnButton.addEventListener('click', handleEndTurn);
    startVotingButton.addEventListener('click', handleStartVoting);
    showVotesButton.addEventListener('click', handleShowVotes);
    closeVotingModal.addEventListener('click', handleCloseVotingModal);
    closeCardinalsModal.addEventListener('click', handleCloseCardinalsModal);
    newGameButton.addEventListener('click', handleNewGame);
}

// Obsługa zdarzeń
function handleDrawCard() {
    const gameState = getGameState();
    if (gameState.phase === 'draw') {
        const card = drawCardForPlayer(gameState.currentPlayer);
        logEvent(`Gracz ${gameState.currentPlayer} dobrał kartę: ${card.name}.`);
        gameState.phase = 'play';
        updateUI();
    }
}

function handlePlayCard() {
    const gameState = getGameState();
    if (gameState.phase === 'play' && gameState.selectedCard) {
        playCard(gameState.selectedCard, gameState.currentPlayer);
    }
}

function handleEndTurn() {
    const gameState = getGameState();
    if (gameState.phase === 'end') {
        endTurn();
    }
}

function handleStartVoting() {
    const gameState = getGameState();
    if (!gameState.votingInProgress && gameState.round === gameState.maxRounds) {
        startVoting();
    }
}

function handleShowVotes() {
    startVoting();
}

function handleCloseVotingModal() {
    votingModal.style.display = 'none';
}

function handleCloseCardinalsModal() {
    cardinalsModal.style.display = 'none';
}

function handleNewGame() {
    gameEndModal.style.display = 'none';
    initGame();
}

// Renderowanie kart na planszy
export function renderBoardCards() {
    const gameState = getGameState();
    boardCardsElement.innerHTML = '';
    
    gameState.boardCards.forEach((card, index) => {
        const cardElement = document.createElement('div');
        cardElement.className = `card ${card.type} ${card.covered ? 'covered' : ''}`;
        cardElement.dataset.index = index;
        
        if (!card.covered) {
            const cardHeader = document.createElement('div');
            cardHeader.className = 'card-header';
            cardHeader.textContent = 'KARDYNAŁ';
            
            const cardTitle = document.createElement('div');
            cardTitle.className = 'card-title';
            cardTitle.textContent = card.name;
            
            const cardSubtitle = document.createElement('div');
            cardSubtitle.className = 'card-subtitle';
            cardSubtitle.textContent = card.country;
            
            const cardChance = document.createElement('div');
            cardChance.className = 'card-chance';
            cardChance.innerHTML = `Szansa: <span class="chance-value">${card.currentChance.toFixed(1)}%</span>`;
            
            const cardDivider = document.createElement('div');
            cardDivider.className = 'card-divider';
            
            const cardTraits = document.createElement('div');
            cardTraits.className = 'card-traits';
            cardTraits.innerHTML = card.traits.map(trait => `• ${trait}`).join('<br>');
            
            cardElement.appendChild(cardHeader);
            cardElement.appendChild(cardTitle);
            cardElement.appendChild(cardSubtitle);
            cardElement.appendChild(cardChance);
            cardElement.appendChild(cardDivider);
            cardElement.appendChild(cardTraits);
        }
        
        boardCardsElement.appendChild(cardElement);
    });
}

// Renderowanie kart w ręce gracza
export function renderPlayerHand(player) {
    const gameState = getGameState();
    const handElement = player === 1 ? player1Hand : player2Hand;
    handElement.innerHTML = '';
    
    const cards = player === 1 ? gameState.player1Hand : gameState.player2Hand;
    
    cards.forEach((card, index) => {
        const cardElement = document.createElement('div');
        cardElement.className = `card ${card.type}`;
        cardElement.dataset.index = index;
        
        const cardHeader = document.createElement('div');
        cardHeader.className = 'card-header';
        cardHeader.textContent = card.type === 'cardinal' ? 'KARDYNAŁ' : card.type.toUpperCase();
        
        const cardTitle = document.createElement('div');
        cardTitle.className = 'card-title';
        cardTitle.textContent = card.name;
        
        let cardSubtitle = document.createElement('div');
        cardSubtitle.className = 'card-subtitle';
        
        if (card.type === 'cardinal') {
            cardSubtitle.textContent = card.country;
            
            const cardChance = document.createElement('div');
            cardChance.className = 'card-chance';
            cardChance.innerHTML = `Szansa: <span class="chance-value">${card.currentChance.toFixed(1)}%</span>`;
            
            cardElement.appendChild(cardHeader);
            cardElement.appendChild(cardTitle);
            cardElement.appendChild(cardSubtitle);
            cardElement.appendChild(cardChance);
        } else {
            // Dla kart wpływu
            const cardEffects = document.createElement('div');
            cardEffects.className = 'card-traits';
            cardEffects.innerHTML = card.effects.map(effect => `• ${effect}`).join('<br>');
            
            const cardDuration = document.createElement('div');
            cardDuration.className = 'card-subtitle';
            cardDuration.textContent = `Czas trwania: ${card.duration} ${card.duration === 1 ? 'runda' : 'rundy'}`;
            
            cardElement.appendChild(cardHeader);
            cardElement.appendChild(cardTitle);
            cardElement.appendChild(cardEffects);
            cardElement.appendChild(cardDuration);
        }
        
        // Dodaj event listener tylko do aktywnych kart aktualnego gracza
        if (player === gameState.currentPlayer) {
            cardElement.addEventListener('click', () => {
                // Odznacz wszystkie zaznaczone karty
                handElement.querySelectorAll('.card').forEach(c => c.classList.remove('selected'));
                
                // Zaznacz wybraną kartę
                cardElement.classList.add('selected');
                
                // Aktualizuj stan gry
                setSelectedCard(card, index);
                
                // Aktualizuj stan przycisków
                updateButtonStates();
            });
        } else {
            cardElement.classList.add('inactive');
        }
        
        handElement.appendChild(cardElement);
    });
}

// Aktualizacja całego interfejsu
export function updateUI() {
    const gameState = getGameState();
    
    // Aktualizuj wskaźniki tury i rundy
    turnIndicator.textContent = `Tura Gracza ${gameState.currentPlayer}`;
    roundIndicator.textContent = `Runda ${gameState.round} z ${gameState.maxRounds}`;
    
    // Renderuj karty na planszy
    renderBoardCards();
    
    // Renderuj ręce graczy
    renderPlayerHand(1);
    renderPlayerHand(2);
    
    // Aktualizuj liczniki aktywnych kart wpływu
    politicalCards.textContent = gameState.activeInfluences.political.length;
    demonicCards.textContent = gameState.activeInfluences.demonic.length;
    spiritualCards.textContent = gameState.activeInfluences.spiritual.length;
    mediaCards.textContent = gameState.activeInfluences.media.length;
    
    // Aktualizuj stan przycisków
    updateButtonStates();
}

// Aktualizacja stanu przycisków
export function updateButtonStates() {
    const gameState = getGameState();
    
    // Przyciski fazy dobierania
    drawCardButton.disabled = gameState.phase !== 'draw';
    
    // Przyciski fazy zagrywania
    playCardButton.disabled = gameState.phase !== 'play' || gameState.selectedCard === null;
    
    // Przyciski fazy kończenia
    endTurnButton.disabled = gameState.phase !== 'end';
    
    // Przycisk głosowania
    startVotingButton.disabled = gameState.votingInProgress || gameState.round < gameState.maxRounds;
}

// Dodawanie wpisów do logu
export function logEvent(message) {
    const logEntry = document.createElement('div');
    logEntry.className = 'log-entry';
    logEntry.textContent = message;
    gameLog.appendChild(logEntry);
    gameLog.scrollTop = gameLog.scrollHeight;
}

// Pokaż modal z wynikami głosowania
export function showVotingResultsModal() {
    const gameState = getGameState();
    votingResults.innerHTML = '';
    
    gameState.votingResults.forEach(result => {
        const voteBar = document.createElement('div');
        voteBar.className = 'vote-bar';
        
        const voteName = document.createElement('div');
        voteName.className = 'vote-name';
        voteName.textContent = result.name;
        
        const voteProgress = document.createElement('div');
        voteProgress.className = 'vote-progress';
        
        const voteFill = document.createElement('div');
        voteFill.className = 'vote-fill';
        voteFill.style.width = `${result.percentage}%`;
        
        const votePercentage = document.createElement('div');
        votePercentage.className = 'vote-percentage';
        votePercentage.textContent = `${result.percentage}%`;
        
        voteProgress.appendChild(voteFill);
        voteBar.appendChild(voteName);
        voteBar.appendChild(voteProgress);
        voteBar.appendChild(votePercentage);
        
        votingResults.appendChild(voteBar);
    });
    
    votingModal.style.display = 'flex';
}

// Pokaż modal z zakończeniem gry
export function showGameEndModal() {
    const gameState = getGameState();
    
    winnerInfo.innerHTML = `
        <p>Konklawe wybrało nowego papieża!</p>
        <h3>${gameState.winner.name}</h3>
        <p>Uzyskał ${gameState.winner.percentage}% głosów.</p>
    `;
    
    gameEndModal.style.display = 'flex';
}