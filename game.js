// Stan gry
let gameState = {
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

// Inicjalizacja gry
function initGame() {
    // Resetuj stan gry
    gameState = {
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
        phase: 'draw',
        votingInProgress: false,
        votingResults: {},
        winner: null
    };

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
    
    // Włącz/wyłącz odpowiednie przyciski
    updateButtonStates();
}

// Losowe dobieranie karty
function drawCardForPlayer(player) {
    // Losuj typ karty (kardynał lub wpływ)
    const cardType = Math.random() < 0.4 ? 'cardinal' : 'influence';
    
    let card;
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
    if (player === 1) {
        gameState.player1Hand.push(card);
    } else {
        gameState.player2Hand.push(card);
    }
    
    return card;
}

// Umieszczanie zakrytych kart kardynałów na planszy
function placeCardinalsOnBoard() {
    // Wybierz losowo 5 kardynałów
    const selectedCardinals = [...cardinals].sort(() => 0.5 - Math.random()).slice(0, 5);
    
    // Dodaj ich do planszy jako zakryte karty
    gameState.boardCards = selectedCardinals.map(cardinal => {
        const cardCopy = JSON.parse(JSON.stringify(cardinal));
        cardCopy.covered = true;
        return cardCopy;
    });
}

// Odkrywanie karty na planszy
function revealCard(index) {
    if (gameState.boardCards[index] && gameState.boardCards[index].covered) {
        gameState.boardCards[index].covered = false;
        renderBoardCards();
        logEvent(`Karta ${gameState.boardCards[index].name} została odkryta!`);
        return true;
    }
    return false;
}

// Zagrywanie karty z ręki
function playCard(card, playerIndex) {
    if (card.type === 'cardinal') {
        logEvent(`Gracz ${playerIndex} zagrał kardynała ${card.name}.`);
        // Dodaj efekty karty kardynała...
    } else {
        // Dodaj kartę wpływu do aktywnych wpływów
        gameState.activeInfluences[card.type].push({
            ...card,
            remainingDuration: card.duration,
            playedBy: playerIndex
        });
        
        logEvent(`Gracz ${playerIndex} zagrał kartę ${card.type}: ${card.name}.`);
        
        // Zastosuj efekty karty...
        applyCardEffects(card);
    }
    
    // Usuń kartę z ręki gracza
    if (playerIndex === 1) {
        gameState.player1Hand = gameState.player1Hand.filter(c => c !== card);
    } else {
        gameState.player2Hand = gameState.player2Hand.filter(c => c !== card);
    }
    
    gameState.selectedCard = null;
    gameState.selectedCardIndex = null;
    
    // Odkryj losową kartę na planszy
    const coveredCards = gameState.boardCards.map((c, i) => c.covered ? i : -1).filter(i => i !== -1);
    if (coveredCards.length > 0) {
        const randomIndex = coveredCards[Math.floor(Math.random() * coveredCards.length)];
        revealCard(randomIndex);
    }
    
    gameState.phase = 'end';
    updateUI();
    updateButtonStates();
}

// Aplikacja efektów karty
function applyCardEffects(card) {
    // Implementacja efektów różnych kart
    switch(card.id) {
        case 'trump':
            // Zwiększ szanse kardynałów z USA i konserwatywnych
            gameState.boardCards.forEach(cardinal => {
                if (cardinal.country === 'USA') {
                    cardinal.currentChance += 5;
                }
                if (cardinal.traits.some(trait => trait.includes('Konserwatyw'))) {
                    cardinal.currentChance += 3;
                }
                if (cardinal.traits.some(trait => trait.includes('Progresyw'))) {
                    cardinal.currentChance -= 3;
                }
            });
            break;
            
        case 'false-revelation':
            // Implementacja efektu fałszywego objawienia
            // Efekt wymagałby wybrania celu - uproszczona implementacja
            const randomCardinal = gameState.boardCards[Math.floor(Math.random() * gameState.boardCards.length)];
            randomCardinal.currentChance += 10;
            logEvent(`Fałszywe Objawienie wpłynęło na kardynała ${randomCardinal.name}.`);
            break;
            
        case 'angel-protection':
            // Neutralizuje wpływy demoniczne
            gameState.activeInfluences.demonic = [];
            logEvent("Ochrona Anielska neutralizuje wszystkie wpływy demoniczne.");
            break;
            
        case 'media-scandal':
            // Implementacja efektu afery medialnej
            const targetCardinal = gameState.boardCards[Math.floor(Math.random() * gameState.boardCards.length)];
            const lostSupport = 7;
            targetCardinal.currentChance -= lostSupport;
            
            // Rozdziel utracone poparcie między pozostałych
            const otherCardinals = gameState.boardCards.filter(c => c.id !== targetCardinal.id);
            const supportPerCardinal = lostSupport / otherCardinals.length;
            otherCardinals.forEach(c => {
                c.currentChance += supportPerCardinal;
            });
            
            logEvent(`Afera Medialna dotknęła kardynała ${targetCardinal.name}, który stracił 7% poparcia.`);
            break;
            
        // Implementacja pozostałych kart
        case 'power-temptation':
            const temptedCardinal = gameState.boardCards[Math.floor(Math.random() * gameState.boardCards.length)];
            temptedCardinal.currentChance += 8;
            temptedCardinal.resistance -= 2;
            logEvent(`Pokusa Władzy dotknęła kardynała ${temptedCardinal.name}, zwiększając jego szanse, ale osłabiając odporność.`);
            break;
            
        case 'diplomatic-pressure':
            // Wybierz losowy region
            const regions = ['Włochy', 'Europa Wschodnia', 'Azja', 'Ameryka', 'Afryka'];
            const targetRegion = regions[Math.floor(Math.random() * regions.length)];
            const effect = Math.random() < 0.5 ? 4 : -4;
            
            gameState.boardCards.forEach(cardinal => {
                if (cardinal.country === targetRegion || 
                    (targetRegion === 'Europa Wschodnia' && (cardinal.country === 'Polska' || cardinal.country === 'Węgry')) ||
                    (targetRegion === 'Azja' && cardinal.country === 'Filipiny') ||
                    (targetRegion === 'Ameryka' && cardinal.country === 'USA')) {
                    cardinal.currentChance += effect;
                }
            });
            
            logEvent(`Naciski Dyplomatyczne wpłynęły na kardynałów z regionu ${targetRegion} (${effect > 0 ? '+' : ''}${effect}%).`);
            break;
            
        case 'holy-spirit':
            // Przywróć szanse bazowe wszystkich kardynałów
            gameState.boardCards.forEach(cardinal => {
                cardinal.currentChance = cardinal.baseChance;
            });
            
            // Usuń wszystkie negatywne wpływy
            gameState.activeInfluences.demonic = [];
            gameState.activeInfluences.political = gameState.activeInfluences.political.filter(infl => 
                !infl.effects.some(e => e.includes('-'))
            );
            gameState.activeInfluences.media = gameState.activeInfluences.media.filter(infl => 
                !infl.effects.some(e => e.includes('-'))
            );
            
            logEvent("Światło Ducha Świętego przywróciło równowagę i usunęło negatywne wpływy.");
            break;
            
        case 'public-support':
            const supportedCardinal = gameState.boardCards[Math.floor(Math.random() * gameState.boardCards.length)];
            supportedCardinal.currentChance += 6;
            supportedCardinal.resistance += 1;
            
            logEvent(`Wsparcie Opinii pomogło kardynałowi ${supportedCardinal.name}, zwiększając jego szanse i odporność.`);
            break;
    }
}

// Zakończenie tury
function endTurn() {
    // Zmniejsz czas trwania aktywnych wpływów
    Object.keys(gameState.activeInfluences).forEach(type => {
        gameState.activeInfluences[type] = gameState.activeInfluences[type].map(influence => {
            if (influence.remainingDuration > 0) {
                influence.remainingDuration--;
            }
            return influence;
        }).filter(influence => influence.remainingDuration > 0);
    });
    
    // Zmień aktualnego gracza
    gameState.currentPlayer = gameState.currentPlayer === 1 ? 2 : 1;
    
    // Jeśli to koniec rundy
    if (gameState.currentPlayer === 1) {
        gameState.round++;
        logEvent(`Rozpoczyna się runda ${gameState.round}.`);
        
        // Sprawdź czy osiągnięto limit rund
        if (gameState.round > gameState.maxRounds) {
            startVoting();
        }
    }
    
    // Zresetuj fazę do dobierania
    gameState.phase = 'draw';
    
    // Aktualizuj UI
    updateUI();
    updateButtonStates();
    
    logEvent(`Tura przechodzi do Gracza ${gameState.currentPlayer}.`);
}

// Głosowanie
function startVoting() {
    gameState.votingInProgress = true;
    logEvent("Rozpoczyna się głosowanie!");
    
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
    gameState.votingResults = Object.values(votingResults).sort((a, b) => b.votes - a.votes);
    
    // Sprawdź czy któryś kardynał osiągnął 2/3 głosów
    const winner = Object.values(votingResults).find(result => result.votes / totalVotes >= 2/3);
    
    if (winner) {
        gameState.winner = winner;
        logEvent(`Kardynał ${winner.name} został wybrany na papieża z wynikiem ${winner.percentage}% głosów!`);
        showGameEnd();
    } else {
        // Jeśli nie ma zwycięzcy, pokaż wyniki głosowania
        showVotingResults();
        
        // Przejdź do kolejnej rundy lub zakończ grę
        if (gameState.round >= gameState.maxRounds) {
            // Zwycięzcą zostaje kardynał z największą liczbą głosów
            gameState.winner = gameState.votingResults[0];
            logEvent(`Po ${gameState.maxRounds} rundach, kardynał ${gameState.winner.name} został wybrany na papieża z wynikiem ${gameState.winner.percentage}% głosów.`);
            showGameEnd();
        } else {
            gameState.votingInProgress = false;
            logEvent("Głosowanie nie wyłoniło papieża. Konklawe będzie kontynuowane.");
        }
    }
    
    updateUI();
}

// Pokaż wyniki głosowania
function showVotingResults() {
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

// Pokaż ekran zakończenia gry
function showGameEnd() {
    winnerInfo.innerHTML = `
        <p>Konklawe wybrało nowego papieża!</p>
        <h3>${gameState.winner.name}</h3>
        <p>Uzyskał ${gameState.winner.percentage}% głosów.</p>
    `;
    
    gameEndModal.style.display = 'flex';
}

// Renderowanie kart na planszy
function renderBoardCards() {
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
function renderPlayerHand(player) {
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
                gameState.selectedCard = card;
                gameState.selectedCardIndex = index;
                
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
function updateUI() {
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
function updateButtonStates() {
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
function logEvent(message) {
    const logEntry = document.createElement('div');
    logEntry.className = 'log-entry';
    logEntry.textContent = message;
    gameLog.appendChild(logEntry);
    gameLog.scrollTop = gameLog.scrollHeight;
}

// Event listeners
drawCardButton.addEventListener('click', () => {
    if (gameState.phase === 'draw') {
        const card = drawCardForPlayer(gameState.currentPlayer);
        logEvent(`Gracz ${gameState.currentPlayer} dobrał kartę: ${card.name}.`);
        gameState.phase = 'play';
        updateUI();
        updateButtonStates();
    }
});

playCardButton.addEventListener('click', () => {
    if (gameState.phase === 'play' && gameState.selectedCard) {
        playCard(gameState.selectedCard, gameState.currentPlayer);
    }
});

endTurnButton.addEventListener('click', () => {
    if (gameState.phase === 'end') {
        endTurn();
    }
});

startVotingButton.addEventListener('click', () => {
    if (!gameState.votingInProgress && gameState.round === gameState.maxRounds) {
        startVoting();
    }
});

showVotesButton.addEventListener('click', () => {
    // Generuj tymczasowe wyniki oparte na aktualnych szansach
    startVoting();
});

closeVotingModal.addEventListener('click', () => {
    votingModal.style.display = 'none';
});

closeCardinalsModal.addEventListener('click', () => {
    cardinalsModal.style.display = 'none';
});

newGameButton.addEventListener('click', () => {
    gameEndModal.style.display = 'none';
    initGame();
});

// Inicjalizacja gry przy załadowaniu strony
document.addEventListener('DOMContentLoaded', initGame);