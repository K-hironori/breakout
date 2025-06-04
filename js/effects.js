/**
 * ブロック崩しゲーム - エフェクト管理
 * 
 * このファイルはゲームのビジュアルエフェクトを管理します。
 * パーティクルエフェクトなどの視覚的な演出を処理します。
 */

export class ParticleSystem {
  /**
   * パーティクルシステムのコンストラクタ
   */
  constructor() {
    this.particles = [];
    this.gameContainer = document.querySelector('.game-container');
  }
  
  /**
   * パーティクルの生成
   * @param {number} x - パーティクル発生のX座標
   * @param {number} y - パーティクル発生のY座標
   * @param {string} color - パーティクルの色
   * @param {number} count - 生成するパーティクルの数（デフォルト：10）
   */
  createParticles(x, y, color, count = 10) {
    // キャンバスの位置を取得して座標を調整
    const canvas = document.getElementById('gameCanvas');
    const rect = canvas.getBoundingClientRect();
    const particleX = rect.left + x;
    const particleY = rect.top + y;
    
    for (let i = 0; i < count; i++) {
      this.createParticle(particleX, particleY, color);
    }
  }
  
  /**
   * 単一パーティクルの生成
   * @param {number} x - パーティクル発生のX座標
   * @param {number} y - パーティクル発生のY座標
   * @param {string} color - パーティクルの色
   */
  createParticle(x, y, color) {
    // パーティクル要素の作成
    const particle = document.createElement('div');
    particle.className = 'particle';
    
    // パーティクルのサイズ（ランダム）
    const size = Math.random() * 5 + 3;
    particle.style.width = `${size}px`;
    particle.style.height = `${size}px`;
    
    // パーティクルの色
    particle.style.backgroundColor = color;
    
    // パーティクルの初期位置
    particle.style.left = `${x}px`;
    particle.style.top = `${y}px`;
    
    // パーティクルをDOMに追加
    this.gameContainer.appendChild(particle);
    
    // パーティクルの動きを設定
    const angle = Math.random() * Math.PI * 2; // ランダムな角度
    const speed = Math.random() * 3 + 2; // ランダムな速度
    const vx = Math.cos(angle) * speed;
    const vy = Math.sin(angle) * speed;
    const lifetime = Math.random() * 500 + 500; // 寿命（ミリ秒）
    
    // パーティクルの状態を保存
    const particleState = {
      element: particle,
      x,
      y,
      vx,
      vy,
      lifetime,
      opacity: 1,
      gravity: 0.1
    };
    
    // パーティクルリストに追加
    this.particles.push(particleState);
    
    // パーティクルのアニメーションを開始
    this.animateParticles();
  }
  
  /**
   * パーティクルのアニメーション
   */
  animateParticles() {
    // アニメーションがすでに実行中なら何もしない
    if (this.animationRunning) return;
    
    this.animationRunning = true;
    
    const animate = () => {
      // すべてのパーティクルを更新
      for (let i = 0; i < this.particles.length; i++) {
        const p = this.particles[i];
        
        // パーティクルの位置を更新
        p.x += p.vx;
        p.y += p.vy;
        p.vy += p.gravity; // 重力効果
        p.lifetime -= 16; // フレームごとに寿命を減らす
        p.opacity = p.lifetime / 1000; // 寿命に応じて透明度を変更
        
        // パーティクルのスタイルを更新
        p.element.style.left = `${p.x}px`;
        p.element.style.top = `${p.y}px`;
        p.element.style.opacity = p.opacity;
        
        // 寿命が尽きたパーティクルを削除
        if (p.lifetime <= 0) {
          p.element.remove();
          this.particles.splice(i, 1);
          i--;
        }
      }
      
      // パーティクルが残っていればアニメーションを続行
      if (this.particles.length > 0) {
        requestAnimationFrame(animate);
      } else {
        this.animationRunning = false;
      }
    };
    
    // アニメーションを開始
    requestAnimationFrame(animate);
  }
  
  /**
   * すべてのパーティクルをクリア
   */
  clearParticles() {
    for (const p of this.particles) {
      p.element.remove();
    }
    this.particles = [];
  }
}
