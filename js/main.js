/**
 * ブロック崩しゲーム - メインエントリーポイント
 * 
 * このファイルはゲームの初期化と画面遷移を管理します。
 * ES6モジュールを使用して、各コンポーネントを分離しています。
 */

import { Game } from './game.js';
import { UI } from './ui.js';
import { SoundManager } from './sound.js';
import { ParticleSystem } from './effects.js';

// ゲームの状態管理
const gameState = {
  currentScreen: 'start', // 'start', 'game', 'gameOver', 'clear'
  score: 0,
  lives: 3,
  level: 1
};

// 各マネージャーのインスタンス
let game;
let ui;
let sound;
let particles;

/**
 * ゲームの初期化
 */
function init() {
  // 各マネージャーの初期化
  ui = new UI();
  sound = new SoundManager();
  particles = new ParticleSystem();
  
  // イベントリスナーの設定
  document.getElementById('start-button').addEventListener('click', startGame);
  document.getElementById('retry-button').addEventListener('click', restartGame);
  document.getElementById('next-button').addEventListener('click', nextLevel);
  
  // 画面サイズの調整
  window.addEventListener('resize', resizeGame);
  resizeGame();
}

/**
 * ゲームの開始
 */
function startGame() {
  gameState.currentScreen = 'game';
  gameState.score = 0;
  gameState.lives = 3;
  gameState.level = 1;
  
  ui.updateScore(gameState.score);
  ui.updateLives(gameState.lives);
  ui.showScreen('game');
  
  // ゲームの初期化と開始
  game = new Game(
    onScoreUpdate,
    onLifeLost,
    onGameOver,
    onLevelClear,
    particles,
    sound,
    gameState.level
  );
  game.start();
}

/**
 * ゲームの再開始
 */
function restartGame() {
  gameState.score = 0;
  gameState.lives = 3;
  gameState.level = 1;
  
  ui.updateScore(gameState.score);
  ui.updateLives(gameState.lives);
  ui.showScreen('game');
  
  game = new Game(
    onScoreUpdate,
    onLifeLost,
    onGameOver,
    onLevelClear,
    particles,
    sound,
    gameState.level
  );
  game.start();
}

/**
 * 次のレベルへ進む
 */
function nextLevel() {
  gameState.level++;
  
  ui.showScreen('game');
  
  game = new Game(
    onScoreUpdate,
    onLifeLost,
    onGameOver,
    onLevelClear,
    particles,
    sound,
    gameState.level
  );
  game.start();
}

/**
 * スコア更新時のコールバック
 */
function onScoreUpdate(points) {
  gameState.score += points;
  ui.updateScore(gameState.score);
}

/**
 * ライフ減少時のコールバック
 */
function onLifeLost() {
  gameState.lives--;
  ui.updateLives(gameState.lives);
  ui.flashScreen();
  
  // モバイルデバイスの場合、バイブレーション
  if (navigator.vibrate) {
    navigator.vibrate(200);
  }
  
  if (gameState.lives <= 0) {
    onGameOver();
  }
}

/**
 * ゲームオーバー時のコールバック
 */
function onGameOver() {
  gameState.currentScreen = 'gameOver';
  ui.showGameOver(gameState.score);
  sound.playGameOver();
}

/**
 * レベルクリア時のコールバック
 */
function onLevelClear() {
  gameState.currentScreen = 'clear';
  ui.showLevelClear(gameState.score);
  sound.playStageClear();
}

/**
 * 画面サイズ変更時の処理
 */
function resizeGame() {
  const gameContainer = document.querySelector('.game-container');
  const canvas = document.getElementById('gameCanvas');
  
  // アスペクト比を維持しながら最大サイズに調整
  const containerWidth = gameContainer.clientWidth;
  const containerHeight = gameContainer.clientHeight;
  const aspectRatio = 4/3; // 標準的なゲーム画面の比率
  
  let width, height;
  
  if (containerWidth / containerHeight > aspectRatio) {
    // 幅が広すぎる場合、高さに合わせる
    height = containerHeight;
    width = height * aspectRatio;
  } else {
    // 高さが高すぎる場合、幅に合わせる
    width = containerWidth;
    height = width / aspectRatio;
  }
  
  // キャンバスのサイズを設定
  canvas.width = width;
  canvas.height = height;
  
  // ゲームが実行中なら、サイズ変更を通知
  if (game) {
    game.resize(width, height);
  }
}

// DOMの読み込み完了時にゲームを初期化
document.addEventListener('DOMContentLoaded', init);
