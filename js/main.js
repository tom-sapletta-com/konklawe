// Główny plik JavaScript inicjujący aplikację
import { initGame } from './gameLogic.js';
import { initEventListeners } from './gameUI.js';

// Po załadowaniu dokumentu uruchom inicjalizację gry
document.addEventListener('DOMContentLoaded', () => {
    console.log('Inicjalizacja gry Konklawe...');
    
    // Inicjalizacja event listenerów
    initEventListeners();
    
    // Inicjalizacja gry
    initGame();
});