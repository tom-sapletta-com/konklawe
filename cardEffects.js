// Moduł do obsługi efektów kart
import { getGameState, updateCardinalChance } from './gameState.js';
import { logEvent } from './gameUI.js';

// Główna funkcja aplikująca efekty kart
export function applyCardEffects(card) {
    const gameState = getGameState();
    
    // Implementacja efektów różnych kart
    switch(card.id) {
        case 'trump':
            // Zwiększ szanse kardynałów z USA i konserwatywnych
            gameState.boardCards.forEach(cardinal => {
                if (cardinal.country === 'USA') {
                    updateCardinalChance(cardinal.id, cardinal.currentChance + 5);
                    logEvent(`Nacisk Trumpa zwiększa szanse kardynała ${cardinal.name} o +5%.`);
                }
                if (cardinal.traits.some(trait => trait.includes('Konserwatyw'))) {
                    updateCardinalChance(cardinal.id, cardinal.currentChance + 3);
                    logEvent(`Nacisk Trumpa zwiększa szanse konserwatywnego kardynała ${cardinal.name} o +3%.`);
                }
                if (cardinal.traits.some(trait => trait.includes('Progresyw'))) {
                    updateCardinalChance(cardinal.id, cardinal.currentChance - 3);
                    logEvent(`Nacisk Trumpa zmniejsza szanse progresywnego kardynała ${cardinal.name} o -3%.`);
                }
            });
            break;
            
        case 'false-revelation':
            // Implementacja efektu fałszywego objawienia
            // Efekt wymagałby wybrania celu - uproszczona implementacja
            const randomCardinal = gameState.boardCards[Math.floor(Math.random() * gameState.boardCards.length)];
            updateCardinalChance(randomCardinal.id, randomCardinal.currentChance + 10);
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
            updateCardinalChance(targetCardinal.id, targetCardinal.currentChance - lostSupport);
            
            // Rozdziel utracone poparcie między pozostałych
            const otherCardinals = gameState.boardCards.filter(c => c.id !== targetCardinal.id);
            const supportPerCardinal = lostSupport / otherCardinals.length;
            otherCardinals.forEach(c => {
                updateCardinalChance(c.id, c.currentChance + supportPerCardinal);
            });
            
            logEvent(`Afera Medialna dotknęła kardynała ${targetCardinal.name}, który stracił 7% poparcia.`);
            break;
            
        // Implementacja pozostałych kart
        case 'power-temptation':
            const temptedCardinal = gameState.boardCards[Math.floor(Math.random() * gameState.boardCards.length)];
            updateCardinalChance(temptedCardinal.id, temptedCardinal.currentChance + 8);
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
                    updateCardinalChance(cardinal.id, cardinal.currentChance + effect);
                }
            });
            
            logEvent(`Naciski Dyplomatyczne wpłynęły na kardynałów z regionu ${targetRegion} (${effect > 0 ? '+' : ''}${effect}%).`);
            break;
            
        case 'holy-spirit':
            // Przywróć szanse bazowe wszystkich kardynałów
            gameState.boardCards.forEach(cardinal => {
                updateCardinalChance(cardinal.id, cardinal.baseChance);
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
            updateCardinalChance(supportedCardinal.id, supportedCardinal.currentChance + 6);
            supportedCardinal.resistance += 1;
            
            logEvent(`Wsparcie Opinii pomogło kardynałowi ${supportedCardinal.name}, zwiększając jego szanse i odporność.`);
            break;
            
        case 'vatican-insider':
            // Odkryj losową kartę na planszy
            const coveredCards = gameState.boardCards
                .map((c, i) => c.covered ? i : -1)
                .filter(i => i !== -1);
                
            if (coveredCards.length > 0) {
                const randomIndex = coveredCards[Math.floor(Math.random() * coveredCards.length)];
                gameState.boardCards[randomIndex].covered = false;
                
                // Zwiększ szanse wybranego kardynała
                const insiderTarget = gameState.boardCards[Math.floor(Math.random() * gameState.boardCards.length)];
                updateCardinalChance(insiderTarget.id, insiderTarget.currentChance + 3);
                
                logEvent(`Informator z Watykanu odkrył kardynała ${gameState.boardCards[randomIndex].name} i zwiększył szanse kardynała ${insiderTarget.name}.`);
            }
            break;
            
        case 'demon-doubt':
            // Zmniejsz szanse wszystkich kardynałów
            gameState.boardCards.forEach(cardinal => {
                updateCardinalChance(cardinal.id, cardinal.currentChance - 2);
                cardinal.resistance -= 1;
            });
            
            logEvent("Ziarno Zwątpienia zmniejszyło szanse wszystkich kardynałów i osłabiło ich odporność.");
            break;
            
        case 'papal-audience':
            // Pozwól zajrzeć na zakryte karty (w praktyce odkryj jedną)
            const coveredCardsForAudience = gameState.boardCards
                .map((c, i) => c.covered ? i : -1)
                .filter(i => i !== -1);
                
            if (coveredCardsForAudience.length > 0) {
                const randomIndex = coveredCardsForAudience[Math.floor(Math.random() * coveredCardsForAudience.length)];
                gameState.boardCards[randomIndex].covered = false;
                
                // Zwiększ odporność duchową wszystkich kardynałów
                gameState.boardCards.forEach(cardinal => {
                    cardinal.resistance += 2;
                });
                
                logEvent(`Modlitwa o Rozeznanie odkryła kardynała ${gameState.boardCards[randomIndex].name} i zwiększyła odporność duchową wszystkich.`);
            }
            break;
            
        case 'conservative-alliance':
            // Zwiększ szanse konserwatywnych kardynałów
            gameState.boardCards.forEach(cardinal => {
                if (cardinal.traits.some(trait => trait.includes('Konserwatyw'))) {
                    updateCardinalChance(cardinal.id, cardinal.currentChance + 4);
                    logEvent(`Sojusz Konserwatystów zwiększa szanse kardynała ${cardinal.name} o +4%.`);
                }
            });
            
            // Zmniejsz wpływ mediów
            gameState.activeInfluences.media.forEach(influence => {
                influence.remainingDuration = Math.max(0, influence.remainingDuration - 2);
            });
            
            logEvent("Sojusz Konserwatystów osłabił wpływ mediów.");
            break;
            
        case 'progressive-coalition':
            // Zwiększ szanse progresywnych kardynałów
            gameState.boardCards.forEach(cardinal => {
                if (cardinal.traits.some(trait => trait.includes('Progresyw')) || 
                    cardinal.traits.some(trait => trait.includes('Franciszk'))) {
                    updateCardinalChance(cardinal.id, cardinal.currentChance + 4);
                    logEvent(`Koalicja Progresywna zwiększa szanse kardynała ${cardinal.name} o +4%.`);
                }
            });
            
            // Neutralizuj wpływ Trumpa
            gameState.activeInfluences.political = gameState.activeInfluences.political.filter(infl => 
                infl.id !== 'trump'
            );
            
            logEvent("Koalicja Progresywna zneutralizowała wpływ Trumpa.");
            break;
    }
    
    return gameState;
}