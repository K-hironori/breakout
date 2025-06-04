/**
 * ブロック崩しゲーム - UI管理
 * 
 * このファイルはゲームのUI要素を管理します。
 * 画面遷移、スコア表示、アニメーションなどを処理します。
 */

export class UI {
  /**
   * UIクラスのコンストラクタ
   */
  constructor() {
    // 画面要素の参照
    this.startScreen = document.getElementById('start-screen');
    this.gameScreen = document.getElementById('game-screen');
    this.gameOverScreen = document.getElementById('game-over-screen');
    this.clearScreen = document.getElementById('clear-screen');
    
    // スコアと残機の表示要素
    this.scoreElement = document.getElementById('score');
    this.livesElement = document.getElementById('lives');
    this.finalScoreElement = document.getElementById('final-score');
    this.clearScoreElement = document.getElementById('clear-score');
    
    // キャンバス
    this.canvas = document.getElementById('gameCanvas');
  }
  
  /**
   * 指定した画面を表示
   * @param {string} screenName - 表示する画面の名前 ('start', 'game', 'gameOver', 'clear')
   */
  showScreen(screenName) {
    // すべての画面を非表示
    this.startScreen.classList.add('hidden');
    this.gameScreen.classList.add('hidden');
    this.gameOverScreen.classList.add('hidden');
    this.clearScreen.classList.add('hidden');
    
    // 指定した画面を表示
    switch (screenName) {
      case 'start':
        this.startScreen.classList.remove('hidden');
        this.startScreen.classList.add('fade-in');
        break;
      case 'game':
        this.gameScreen.classList.remove('hidden');
        break;
      case 'gameOver':
        this.gameOverScreen.classList.remove('hidden');
        this.gameOverScreen.classList.add('fade-in');
        this.animateScore();
        break;
      case 'clear':
        this.clearScreen.classList.remove('hidden');
        this.clearScreen.classList.add('fade-in');
        this.animateScore('clear');
        break;
    }
  }
  
  /**
   * スコアの更新
   * @param {number} score - 新しいスコア
   */
  updateScore(score) {
    this.scoreElement.textContent = score;
  }
  
  /**
   * 残機の更新
   * @param {number} lives - 残りの残機数
   */
  updateLives(lives) {
    this.livesElement.textContent = lives;
  }
  
  /**
   * ゲームオーバー画面の表示
   * @param {number} finalScore - 最終スコア
   */
  showGameOver(finalScore) {
    this.finalScoreElement.textContent = finalScore;
    this.showScreen('gameOver');
  }
  
  /**
   * レベルクリア画面の表示
   * @param {number} score - 現在のスコア
   */
  showLevelClear(score) {
    this.clearScoreElement.textContent = score;
    this.showScreen('clear');
  }
  
  /**
   * スコアのアニメーション表示
   * @param {string} type - アニメーションのタイプ ('gameOver' または 'clear')
   */
  animateScore(type = 'gameOver') {
    const scoreElement = type === 'clear' ? this.clearScoreElement : this.finalScoreElement;
    const finalScore = parseInt(scoreElement.textContent);
    
    // スコアをいったん0に
    scoreElement.textContent = '0';
    
    // カウントアップアニメーション
    let currentScore = 0;
    const duration = 1500; // ミリ秒
    const interval = 16; // ミリ秒（約60FPS）
    const increment = Math.max(1, Math.floor(finalScore / (duration / interval)));
    
    const timer = setInterval(() => {
      currentScore += increment;
      if (currentScore >= finalScore) {
        currentScore = finalScore;
        clearInterval(timer);
        
        // アニメーション完了時にパルスエフェクト
        scoreElement.classList.add('pulse');
        setTimeout(() => {
          scoreElement.classList.remove('pulse');
        }, 1000);
      }
      scoreElement.textContent = currentScore;
    }, interval);
  }
  
  /**
   * 画面のフラッシュ効果（ライフ減少時など）
   */
  flashScreen() {
    this.canvas.classList.add('flash');
    setTimeout(() => {
      this.canvas.classList.remove('flash');
    }, 300);
  }
}
