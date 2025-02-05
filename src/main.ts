import { Component, OnInit } from '@angular/core';
import { bootstrapApplication } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { GameService } from './app/game.service';

@Component({
    selector: 'app-root',
    imports: [CommonModule, FormsModule],
    template: `
    <div class="min-h-screen romantic-bg">
      <div class="container mx-auto px-4 py-8">
        <!-- Progress Bar -->
        <div *ngIf="gameState.currentLevel > 0" class="mb-8">
          <div class="w-full bg-white rounded-full h-4 shadow-inner">
            <div
              class="bg-[#ff6b6b] h-4 rounded-full transition-all duration-500"
              [style.width]="gameState.progress + '%'"
            ></div>
          </div>
          <p class="text-center mt-2 text-gray-600">
            Progreso: {{gameState.progress}}%
          </p>
        </div>

        <!-- Welcome Screen -->
        <div *ngIf="gameState.currentLevel === 0" class="fade-in text-center">
          <h1 class="text-4xl font-bold text-[#ff6b6b] mb-6">
            Escape Room Romántico
          </h1>
          <p class="text-lg mb-8 text-gray-700">
            Bienvenido/a a una aventura llena de amor y misterio.
            ¿Te atreves a descubrir todos los secretos?
          </p>
          <button (click)="startGame()" class="romantic-button">
            Comenzar Aventura
          </button>
        </div>

        <!-- Level 1: Encontrar los pares -->
        <div *ngIf="gameState.currentLevel === 1" class="fade-in">
          <h2 class="text-2xl font-bold text-center text-[#ff6b6b] mb-6">
            Nivel 1: Encuentra las Parejas
          </h2>
          
          <!-- Instrucciones del juego -->
          <div class="max-w-md mx-auto mb-8 bg-white p-4 rounded-lg shadow-md">
            <h3 class="text-lg font-bold text-[#ff6b6b] mb-2">¿Cómo jugar?</h3>
            <ul class="list-disc list-inside space-y-2 text-gray-700">
              <li>Encuentra las parejas de emojis iguales</li>
              <li>Haz clic en dos cartas para revelarlas</li>
              <li>Si son iguales, ¡has encontrado una pareja!</li>
              <li>Encuentra todas las parejas para ganar</li>
            </ul>
          </div>

          <!-- Juego de memoria -->
          <div class="grid grid-cols-4 gap-4 max-w-md mx-auto mb-6">
            <div *ngFor="let card of cards; let i = index"
                 class="aspect-square bg-[#ffd3d3] rounded-lg shadow-md cursor-pointer 
                        hover:bg-[#ffcaca] transition-all duration-300
                        flex items-center justify-center text-2xl"
                 [class.bg-white]="card.isFlipped"
                 (click)="flipCard(i)">
              <span *ngIf="card.isFlipped">{{card.emoji}}</span>
            </div>
          </div>

          <!-- Contador de parejas -->
          <p class="text-center text-gray-600">
            Parejas encontradas: {{matchedPairs}} de 6
          </p>
        </div>

       <!-- Level 2: Secret Code -->
<div *ngIf="gameState.currentLevel === 2" class="fade-in">
  <h2 class="text-2xl font-bold text-center text-[#ff6b6b] mb-6">
    Nivel 2: El Código Secreto
  </h2>
  <div class="max-w-md mx-auto">
    <p class="text-center text-gray-600 mb-4">
      Descifra el código del amor... 
      Pista: Es una fecha especial (solamente 4 digitos)
    </p>
    <input [(ngModel)]="secretCode" 
           class="input-romantic w-full text-center mb-4"
           placeholder="Ingresa el código...">
    
    <button (click)="checkSecretCode()" class="romantic-button w-full">
      Verificar Código
    </button>
  </div>
</div>


        <!-- Level 3: Relationship Question -->
        <div *ngIf="gameState.currentLevel === 3 && !gameState.completed" class="fade-in">
          <h2 class="text-2xl font-bold text-center text-[#ff6b6b] mb-6">
            Nivel 3: Nuestra Historia
          </h2>
          <div class="max-w-md mx-auto">
            <p class="text-center text-gray-600 mb-4">
              ¿Cuál fue el lugar de nuestra primera cita?
            </p>
            <div class="space-y-4">
              <button *ngFor="let option of relationshipOptions"
                      (click)="checkAnswer(option)"
                      class="romantic-button w-full text-left">
                {{option}}
              </button>
            </div>
          </div>
        </div>

        <!-- Final Screen -->
        <div *ngIf="gameState.completed" class="fade-in text-center">
          <h1 class="text-4xl font-bold text-[#ff6b6b] mb-6">
            ¿Quieres ser mi San Valentín?
          </h1>
          <div class="space-x-4">
            <button (click)="sayYes()" class="romantic-button">
              Sí
            <br>
            </button>
            <button (click)="sayYes()" class="romantic-button">
              ¡Obvio!
            </button>
          </div>
        </div>
         <div class="heart-container" *ngIf="showingHearts">
        <div class="heart-container" *ngIf="showingHearts">
  <div
    *ngFor="let heart of hearts"
    class="heart"
    [style.left.%]="heart.x"
    [style.animation-delay.s]="heart.delay"
    [style.font-size]="heart.size"
  >❤️</div>
</div>

      </div>
    </div>
  `,
    providers: [GameService]
})
export class App implements OnInit {
  gameState = {
    currentLevel: 0,
    progress: 0,
    completed: false
  };

  // Memory game variables
  cards = this.createCards();
  matchedPairs = 0;
  flippedCards: number[] = [];
  canFlip = true;

  // Secret code variables
  secretCode = '';
  correctCode = '0327';

  // Relationship question variables
  relationshipOptions = [
    'En el cine',
    'Cafenio',
    'Mi cuarto',
    'En tu casa'
  ];
  correctAnswer = 'Mi cuarto';

  //Heart animation variables
  showingHearts = false;
  hearts: { x: number; delay: number; size: string }[] = [];

  constructor(private gameService: GameService) {}

  ngOnInit() {
    this.gameService.getGameState().subscribe(state => {
      this.gameState = state;
      if (state.completed) {
        this.startHeartAnimation();
      }
    });
  }

  startHeartAnimation() {
    this.showingHearts = true;
    this.hearts = Array.from({ length: 30 }, () => ({
      x: Math.random() * 100, // Posición en la pantalla (0-100%)
      delay: Math.random() * 2, // Retraso aleatorio
      size: Math.random() * 20 + 10 + 'px' // Tamaño entre 10px y 30px
    }));

    setTimeout(() => {
      this.showingHearts = false; // Ocultar después de un tiempo
    }, 4000);
  }
  startGame() {
    this.gameService.startGame();
    this.shuffleCards();
  }

  createCards() {
    const emojis = ['❤️', '💕', '💝', '💖', '💗', '💓'];
    const pairs = [...emojis, ...emojis];
    return pairs.map(emoji => ({
      emoji,
      isFlipped: false,
      isMatched: false
    }));
  }

  shuffleCards() {
    for (let i = this.cards.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [this.cards[i], this.cards[j]] = [this.cards[j], this.cards[i]];
    }
  }

  flipCard(index: number) {
    if (!this.canFlip) return;
    if (this.cards[index].isFlipped || this.cards[index].isMatched) return;
    if (this.flippedCards.length === 2) return;

    this.cards[index].isFlipped = true;
    this.flippedCards.push(index);

    if (this.flippedCards.length === 2) {
      this.canFlip = false;
      this.checkMatch();
    }
  }

  checkMatch() {
    const [first, second] = this.flippedCards;
    const match = this.cards[first].emoji === this.cards[second].emoji;

    setTimeout(() => {
      if (match) {
        this.cards[first].isMatched = true;
        this.cards[second].isMatched = true;
        this.matchedPairs++;

        if (this.matchedPairs === 6) {
          this.gameService.advanceLevel();
        }
      } else {
        this.cards[first].isFlipped = false;
        this.cards[second].isFlipped = false;
      }

      this.flippedCards = [];
      this.canFlip = true;
    }, 1000);
  }

  checkSecretCode() {
    if (this.secretCode === this.correctCode) {
      this.gameService.advanceLevel();
    }
  }

  checkAnswer(answer: string) {
    if (answer === this.correctAnswer) {
      this.gameService.completeGame();
      this.gameState.completed = true;
    }
  }

  sayYes() {
    alert('¡Has hecho la elección correcta! ❤️');
    
  }
}


bootstrapApplication(App);