// Stan gry - moduł zarządzający stanem gry
export const initialGameState = {
    currentPlayer: 1,
    round: 1,
    maxRounds: 5,
    player1Hand: [],
    player2Hand: [],
    boardCards: [],
    activeInfluences: {
        political: [],
        demonic: [],
        spiritual: [],
        media: []
    },
    selectedCard: null,
    selectedCardIndex: null,
    phase: 'draw', // draw, play, end, voting
    votingInProgress: false,
    votingResults: {},
    winner: null
};

// Funkcja do resetowania stanu gry
export function resetGameState() {
    return JSON.parse(JSON.stringify(initialGameState));
}

// Funkcja do aktualnego stanu gry
let gameState = resetGameState();

// Getter stanu gry
export function getGameState() {
    return gameState;
}

// Setter stanu gry
export function setGameState(newState) {
    gameState = newState;
}

// Aktualizacja części stanu gry
export function updateGameState(partialState) {
    gameState = {
        ...gameState,
        ...partialState
    };
    return gameState;
}

// Funkcje pomocnicze do aktualizacji konkretnych elementów stanu gry
export function setCurrentPlayer(player) {
    gameState.currentPlayer = player;
    return gameState;
}

export function setPhase(phase) {
    gameState.phase = phase;
    return gameState;
}

export function incrementRound() {
    gameState.round++;
    return gameState;
}

export function addCardToPlayerHand(player, card) {
    if (player === 1) {
        gameState.player1Hand.push(card);
    } else {
        gameState.player2Hand.push(card);
    }
    return gameState;
}

export function removeCardFromPlayerHand(player, cardIndex) {
    if (player === 1) {
        gameState.player1Hand.splice(cardIndex, 1);
    } else {
        gameState.player2Hand.splice(cardIndex, 1);
    }
    return gameState;
}

export function setSelectedCard(card, index) {
    gameState.selectedCard = card;
    gameState.selectedCardIndex = index;
    return gameState;
}

export function clearSelectedCard() {
    gameState.selectedCard = null;
    gameState.selectedCardIndex = null;
    return gameState;
}

export function addActiveInfluence(type, influence) {
    gameState.activeInfluences[type].push(influence);
    return gameState;
}

export function updateActiveInfluences() {
    // Zmniejsz czas trwania aktywnych wpływów i usuń te, które się zakończyły
    Object.keys(gameState.activeInfluences).forEach(type => {
        gameState.activeInfluences[type] = gameState.activeInfluences[type]
            .map(influence => {
                if (influence.remainingDuration > 0) {
                    influence.remainingDuration--;
                }
                return influence;
            })
            .filter(influence => influence.remainingDuration > 0);
    });
    
    return gameState;
}

export function setBoardCards(cards) {
    gameState.boardCards = cards;
    return gameState;
}

export function updateCardinalChance(cardinalId, newChance) {
    const cardinalIndex = gameState.boardCards.findIndex(c => c.id === cardinalId);
    if (cardinalIndex !== -1) {
        gameState.boardCards[cardinalIndex].currentChance = newChance;
    }
    return gameState;
}

export function revealBoardCard(index) {
    if (gameState.boardCards[index] && gameState.boardCards[index].covered) {
        gameState.boardCards[index].covered = false;
        return true;
    }
    return false;
}

export function setVotingResults(results) {
    gameState.votingResults = results;
    return gameState;
}

export function setWinner(winner) {
    gameState.winner = winner;
    return gameState;
}

export function setVotingInProgress(inProgress) {
    gameState.votingInProgress = inProgress;
    return gameState;
}