// Moduł zawierający główną logikę gry
import { cardinals, influenceCards } from './data.js';
import { 
    getGameState, 
    setGameState, 
    resetGameState, 
    addCardToPlayerHand, 
    removeCardFromPlayerHand,
    setCurrentPlayer,
    setPhase,
    incrementRound,
    updateActiveInfluences,
    setBoardCards,
    clearSelectedCard,
    revealBoardCard,
    setVotingResults,
    setWinner,
    setVotingInProgress
} from './gameState.js';
import { applyCardEffects } from './cardEffects.js';
import { updateUI, logEvent, showVotingResultsModal, showGameEndModal } from './gameUI.js';

// Inicjalizacja gry
export function initGame() {
    // Resetuj stan gry
    setGameState(resetGameState());
    
    const gameState = getGameState();

    // Ustaw początkowe ręce graczy
    for (let i = 0; i < 3; i++) {
        drawCardForPlayer(1);
        drawCardForPlayer(2);
    }

    // Umieść zakryte karty kardynałów na planszy
    placeCardinalsOnBoard();

    // Aktualizuj interfejs
    updateUI();
    logEvent('Gra rozpoczęta! Gracz 1 zaczyna.');
}

// Losowe dobieranie karty
export function drawCardForPlayer(player) {
    // Losuj typ karty (kardynał lub wpływ)
    const cardType = Math.random() < 0.4 ? 'cardinal' : 'influence';
    
    let card;
    const gameState = getGameState();
    
    if (cardType === 'cardinal') {
        // Losuj kardynała spośród tych, którzy nie są już w rękach graczy
        const availableCardinals = cardinals.filter(c => 
            !gameState.player1Hand.some(card => card.id === c.id) && 
            !gameState.player2Hand.some(card => card.id === c.id) &&
            !gameState.boardCards.some(card => card.id === c.id)
        );
        
        if (availableCardinals.length > 0) {
            const randomIndex = Math.floor(Math.random() * availableCardinals.length);
            card = JSON.parse(JSON.stringify(availableCardinals[randomIndex])); // deep copy
        } else {
            // Jeśli nie ma dostępnych kardynałów, daj kartę wpływu
            const randomIndex = Math.floor(Math.random() * influenceCards.length);
            card = JSON.parse(JSON.stringify(influenceCards[randomIndex])); // deep copy
        }
    } else {
        // Losuj kartę wpływu
        const randomIndex = Math.floor(Math.random() * influenceCards.length);
        card = JSON.parse(JSON.stringify(influenceCards[randomIndex])); // deep copy
    }
    
    // Dodaj kartę do ręki odpowiedniego gracza
    addCardToPlayerHand(player, card);
    
    return card;
}

// Umieszczanie zakrytych kart kardynałów na planszy
export function placeCardinalsOnBoard() {
    // Wybierz losowo 5 kardynałów
    const selectedCardinals = [...cardinals].sort(() => 0.5 - Math.random()).slice(0, 5);
    
    // Dodaj ich do planszy jako zakryte karty
    const boardCards = selectedCardinals.map(cardinal => {
        const cardCopy = JSON.parse(JSON.stringify(cardinal));
        cardCopy.covered = true;
        return cardCopy;
    });
    
    setBoardCards(boardCards);
}

// Zagrywanie karty z ręki
export function playCard(card, playerIndex) {
    const gameState = getGameState();
    
    if (card.type === 'cardinal') {
        logEvent(`Gracz ${playerIndex} zagrał kardynała ${card.name}.`);
        // Dodatkowe efekty karty kardynała można implementować tutaj
    } else {
        // Dodaj kartę wpływu do aktywnych wpływów
        gameState.activeInfluences[card.type].push({
            ...card,
            remainingDuration: card.duration,
            playedBy: playerIndex
        });
        
        logEvent(`Gracz ${playerIndex} zagrał kartę ${card.type}: ${card.name}.`);
        
        // Zastosuj efekty karty
        applyCardEffects(card);
    }
    
    // Usuń kartę z ręki gracza
    removeCardFromPlayerHand(playerIndex, gameState.selectedCardIndex);
    
    // Wyczyść wybraną kartę
    clearSelectedCard();
    
    // Odkryj losową kartę na planszy
    const coveredCards = gameState.boardCards.map((c, i) => c.covered ? i : -1).filter(i => i !== -1);
    if (coveredCards.length > 0) {
        const randomIndex = coveredCards[Math.floor(Math.random() * coveredCards.length)];
        revealBoardCard(randomIndex);
        logEvent(`Karta ${gameState.boardCards[randomIndex].name} została odkryta!`);
    }
    
    // Zmień fazę gry
    setPhase('end');
    
    // Aktualizuj interfejs
    updateUI();
}

// Zakończenie tury
export function endTurn() {
    // Zmniejsz czas trwania aktywnych wpływów
    updateActiveInfluences();
    
    const gameState = getGameState();
    
    // Zmień aktualnego gracza
    const nextPlayer = gameState.currentPlayer === 1 ? 2 : 1;
    setCurrentPlayer(nextPlayer);
    
    // Jeśli to koniec rundy
    if (nextPlayer === 1) {
        incrementRound();
        logEvent(`Rozpoczyna się runda ${gameState.round}.`);
        
        // Sprawdź czy osiągnięto limit rund
        if (gameState.round > gameState.maxRounds) {
            startVoting();
            return;
        }
    }
    
    // Zresetuj fazę do dobierania
    setPhase('draw');
    
    // Aktualizuj UI
    updateUI();
    
    logEvent(`Tura przechodzi do Gracza ${gameState.currentPlayer}.`);
}

// Głosowanie
export function startVoting() {
    setVotingInProgress(true);
    logEvent("Rozpoczyna się głosowanie!");
    
    const gameState = getGameState();
    
    // Oblicz wyniki głosowania na podstawie szans
    let votingResults = {};
    let totalVotes = 0;
    
    gameState.boardCards.forEach(cardinal => {
        // Zaokrąglamy szanse do jednego miejsca po przecinku
        let votes = Math.max(0, parseFloat(cardinal.currentChance.toFixed(1)));
        votingResults[cardinal.id] = {
            name: cardinal.name,
            votes: votes,
            percentage: 0 // Będzie obliczone po zsumowaniu
        };
        totalVotes += votes;
    });
    
    // Oblicz procenty
    Object.keys(votingResults).forEach(cardinalId => {
        votingResults[cardinalId].percentage = (votingResults[cardinalId].votes / totalVotes * 100).toFixed(1);
    });
    
    // Posortuj wyniki
    const sortedResults = Object.values(votingResults).sort((a, b) => b.votes - a.votes);
    setVotingResults(sortedResults);
    
    // Sprawdź czy któryś kardynał osiągnął 2/3 głosów
    const winner = Object.values(votingResults).find(result => result.votes / totalVotes >= 2/3);
    
    if (winner) {
        setWinner(winner);
        logEvent(`Kardynał ${winner.name} został wybrany na papieża z wynikiem ${winner.percentage}% głosów!`);
        showGameEndModal();
    } else {
        // Jeśli nie ma zwycięzcy, pokaż wyniki głosowania
        showVotingResultsModal();
        
        // Przejdź do kolejnej rundy lub zakończ grę
        if (gameState.round >= gameState.maxRounds) {
            // Zwycięzcą zostaje kardynał z największą liczbą głosów
            setWinner(sortedResults[0]);
            logEvent(`Po ${gameState.maxRounds} rundach, kardynał ${sortedResults[0].name} został wybrany na papieża z wynikiem ${sortedResults[0].percentage}% głosów.`);
            showGameEndModal();
        } else {
            setVotingInProgress(false);
            logEvent("Głosowanie nie wyłoniło papieża. Konklawe będzie kontynuowane.");
        }
    }
    
    updateUI();
}