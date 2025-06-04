/**
 * ブロック崩しゲーム - サウンド管理
 * 
 * このファイルはゲームのサウンドエフェクトを管理します。
 * 効果音の再生と音量調整を処理します。
 */

export class SoundManager {
  /**
   * サウンドマネージャーのコンストラクタ
   */
  constructor() {
    // 効果音の要素
    this.hitSound = document.getElementById('hit-sound');
    this.lifeLostSound = document.getElementById('life-lost-sound');
    this.gameOverSound = document.getElementById('game-over-sound');
    this.stageClearSound = document.getElementById('stage-clear-sound');
    
    // 音量設定
    this.setVolume(0.5);
  }
  
  /**
   * 音量の設定
   * @param {number} volume - 音量（0.0〜1.0）
   */
  setVolume(volume) {
    this.hitSound.volume = volume;
    this.lifeLostSound.volume = volume;
    this.gameOverSound.volume = volume;
    this.stageClearSound.volume = volume;
  }
  
  /**
   * ヒット音の再生
   */
  playHit() {
    this.playSound(this.hitSound);
  }
  
  /**
   * ライフ減少音の再生
   */
  playLifeLost() {
    this.playSound(this.lifeLostSound);
  }
  
  /**
   * ゲームオーバー音の再生
   */
  playGameOver() {
    this.playSound(this.gameOverSound);
  }
  
  /**
   * ステージクリア音の再生
   */
  playStageClear() {
    this.playSound(this.stageClearSound);
  }
  
  /**
   * サウンドの再生
   * @param {HTMLAudioElement} sound - 再生するサウンド要素
   */
  playSound(sound) {
    // サウンドが読み込まれていない場合は何もしない
    if (!sound || !sound.src) return;
    
    try {
      // 再生中の場合は一度停止してから再生
      sound.currentTime = 0;
      sound.play().catch(error => {
        // ブラウザのポリシーにより自動再生が拒否された場合など
        console.log('サウンド再生エラー:', error);
      });
    } catch (error) {
      console.log('サウンド再生エラー:', error);
    }
  }
}
