// Funkcje narzędziowe dla gry Konklawe

// Funkcja do ładowania danych kart z pliku JSON
async function loadCardData() {
    try {
        const response = await fetch('cards.json');
        if (!response.ok) {
            throw new Error(`Błąd HTTP: ${response.status}`);
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Błąd podczas ładowania danych:', error);
        // Fallback do danych z data.js jeśli nie można załadować JSON
        return { cardinals, influenceCards };
    }
}

// Funkcja do obliczania wyników głosowania
function calculateVotes(cardinals) {
    let votingResults = {};
    let totalVotes = 0;
    
    cardinals.forEach(cardinal => {
        if (!cardinal.covered) {
            let votes = Math.max(0, parseFloat(cardinal.currentChance.toFixed(1)));
            votingResults[cardinal.id] = {
                name: cardinal.name,
                votes: votes,
                percentage: 0
            };
            totalVotes += votes;
        }
    });
    
    // Oblicz procenty
    Object.keys(votingResults).forEach(cardinalId => {
        votingResults[cardinalId].percentage = (votingResults[cardinalId].votes / totalVotes * 100).toFixed(1);
    });
    
    return {
        results: Object.values(votingResults).sort((a, b) => b.votes - a.votes),
        totalVotes: totalVotes
    };
}

// Funkcja sprawdzająca, czy któryś kardynał osiągnął 2/3 głosów
function checkForWinner(votingResults, totalVotes) {
    return votingResults.find(result => result.votes / totalVotes >= 2/3);
}

// Funkcja aplikująca efekty karty do kardynałów
function applyEffectToCardinals(cardinals, effect) {
    const modifiedCardinals = [...cardinals];
    
    // Przykład efektu: "Kardynałowie USA: +5%"
    if (effect.includes('USA') && effect.includes('+')) {
        const bonus = parseInt(effect.match(/\+(\d+)%/)[1]);
        modifiedCardinals.forEach(cardinal => {
            if (cardinal.country === 'USA') {
                cardinal.currentChance += bonus;
            }
        });
    }
    
    // Efekt dla kardynałów o określonym profilu
    if ((effect.includes('Konserwatyw') || effect.includes('konserwatyw')) && effect.includes('+')) {
        const bonus = parseInt(effect.match(/\+(\d+)%/)[1]);
        modifiedCardinals.forEach(cardinal => {
            if (cardinal.traits.some(trait => trait.toLowerCase().includes('konserwatyw'))) {
                cardinal.currentChance += bonus;
            }
        });
    }
    
    if ((effect.includes('Progresyw') || effect.includes('progresyw')) && effect.includes('+')) {
        const bonus = parseInt(effect.match(/\+(\d+)%/)[1]);
        modifiedCardinals.forEach(cardinal => {
            if (cardinal.traits.some(trait => trait.toLowerCase().includes('progresyw'))) {
                cardinal.currentChance += bonus;
            }
        });
    }
    
    // Anulowanie wszystkich wpływów (resetowanie do wartości bazowych)
    if (effect.includes('Przywraca szanse bazowe')) {
        modifiedCardinals.forEach(cardinal => {
            cardinal.currentChance = cardinal.baseChance;
        });
    }
    
    return modifiedCardinals;
}

// Funkcja do losowego wyboru elementu z tablicy
function getRandomFromArray(array) {
    return array[Math.floor(Math.random() * array.length)];
}

// Funkcja do tworzenia kopii głębokiej obiektu
function deepCopy(obj) {
    return JSON.parse(JSON.stringify(obj));
}

// Eksport funkcji
export {
    loadCardData,
    calculateVotes,
    checkForWinner,
    applyEffectToCardinals,
    getRandomFromArray,
    deepCopy
};