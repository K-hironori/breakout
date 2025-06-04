/**
 * ブロック崩しゲーム - ゲームロジック
 * 
 * このファイルはゲームのコアロジックを管理します。
 * パドル、ボール、ブロックの動作と衝突判定を処理します。
 */

export class Game {
  /**
   * ゲームクラスのコンストラクタ
   * @param {Function} onScoreUpdate - スコア更新時のコールバック
   * @param {Function} onLifeLost - ライフ減少時のコールバック
   * @param {Function} onGameOver - ゲームオーバー時のコールバック
   * @param {Function} onLevelClear - レベルクリア時のコールバック
   * @param {Object} particles - パーティクルシステム
   * @param {Object} sound - サウンドマネージャー
   * @param {Number} level - 現在のレベル
   */
  constructor(onScoreUpdate, onLifeLost, onGameOver, onLevelClear, particles, sound, level = 1) {
    // キャンバスの取得
    this.canvas = document.getElementById('gameCanvas');
    this.ctx = this.canvas.getContext('2d');
    
    // コールバック関数
    this.onScoreUpdate = onScoreUpdate;
    this.onLifeLost = onLifeLost;
    this.onGameOver = onGameOver;
    this.onLevelClear = onLevelClear;
    
    // エフェクトマネージャー
    this.particles = particles;
    this.sound = sound;
    
    // ゲーム状態
    this.level = level;
    this.running = false;
    this.paused = false;
    
    // ゲーム要素の初期化
    this.initGameElements();
    
    // イベントリスナー
    this.setupEventListeners();
  }
  
  /**
   * ゲーム要素の初期化
   */
  initGameElements() {
    const { width, height } = this.canvas;
    
    // パドルの設定
    this.paddle = {
      width: width * 0.15,
      height: height * 0.02,
      x: width / 2 - (width * 0.15) / 2,
      y: height * 0.9,
      speed: width * 0.01,
      dx: 0
    };
    
    // ボールの設定
    this.ball = {
      radius: Math.min(width, height) * 0.015,
      x: width / 2,
      y: height * 0.8,
      dx: 0,
      dy: -height * 0.005,
      speed: height * 0.005,
      maxSpeed: height * 0.015
    };
    
    // ブロックの設定
    this.blockRows = 5;
    this.blockCols = 8;
    this.blockPadding = 10;
    this.blockOffsetTop = height * 0.1;
    this.blockOffsetLeft = width * 0.05;
    this.blocks = [];
    
    // レベルに応じたブロック配置
    this.createBlocks();
    
    // 初期速度の設定
    this.setInitialBallVelocity();
  }
  
  /**
   * レベルに応じたブロックの作成
   */
  createBlocks() {
    const { width } = this.canvas;
    const blockWidth = (width * 0.9 - this.blockPadding * (this.blockCols + 1)) / this.blockCols;
    const blockHeight = this.canvas.height * 0.04;
    
    for (let r = 0; r < this.blockRows; r++) {
      this.blocks[r] = [];
      for (let c = 0; c < this.blockCols; c++) {
        // ブロックタイプの決定（レベルに応じて硬いブロックやパワーアップブロックの割合を増加）
        let type = 'normal'; // 通常ブロック
        let strength = 1;
        
        // レベルに応じた確率で特殊ブロックを配置
        const rand = Math.random();
        if (this.level >= 2 && rand < 0.1 + (this.level - 2) * 0.05) {
          type = 'power'; // パワーアップブロック
          strength = 1;
        } else if (this.level >= 1 && rand < 0.2 + (this.level - 1) * 0.1) {
          type = 'hard'; // 硬いブロック
          strength = 2;
        }
        
        this.blocks[r][c] = {
          x: this.blockOffsetLeft + c * (blockWidth + this.blockPadding),
          y: this.blockOffsetTop + r * (blockHeight + this.blockPadding),
          width: blockWidth,
          height: blockHeight,
          type,
          strength,
          visible: true
        };
      }
    }
  }
  
  /**
   * 初期ボール速度の設定
   */
  setInitialBallVelocity() {
    const { height } = this.canvas;
    const baseSpeed = height * 0.005;
    
    // レベルに応じて初期速度を上げる
    const levelSpeedIncrease = baseSpeed * 0.2 * (this.level - 1);
    this.ball.speed = baseSpeed + levelSpeedIncrease;
    
    // ランダムな方向（左右）に打ち出す
    const angle = Math.random() * Math.PI / 4 - Math.PI / 8; // -π/8 から π/8 の範囲
    this.ball.dx = this.ball.speed * Math.sin(angle);
    this.ball.dy = -this.ball.speed * Math.cos(angle);
  }
  
  /**
   * イベントリスナーの設定
   */
  setupEventListeners() {
    // キーボード操作
    document.addEventListener('keydown', this.handleKeyDown.bind(this));
    document.addEventListener('keyup', this.handleKeyUp.bind(this));
    
    // タッチ操作
    this.canvas.addEventListener('touchstart', this.handleTouchStart.bind(this));
    this.canvas.addEventListener('touchmove', this.handleTouchMove.bind(this));
    this.canvas.addEventListener('touchend', this.handleTouchEnd.bind(this));
    
    // マウス操作
    this.canvas.addEventListener('mousedown', this.handleMouseDown.bind(this));
    this.canvas.addEventListener('mousemove', this.handleMouseMove.bind(this));
    this.canvas.addEventListener('mouseup', this.handleMouseUp.bind(this));
  }
  
  /**
   * キーボードの押下イベント処理
   */
  handleKeyDown(e) {
    if (e.key === 'ArrowRight') {
      this.paddle.dx = this.paddle.speed;
    } else if (e.key === 'ArrowLeft') {
      this.paddle.dx = -this.paddle.speed;
    }
  }
  
  /**
   * キーボードのリリースイベント処理
   */
  handleKeyUp(e) {
    if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') {
      this.paddle.dx = 0;
    }
  }
  
  /**
   * タッチ開始イベント処理
   */
  handleTouchStart(e) {
    e.preventDefault();
    this.touchStartX = e.touches[0].clientX;
    this.isTouching = true;
  }
  
  /**
   * タッチ移動イベント処理
   */
  handleTouchMove(e) {
    if (!this.isTouching) return;
    
    e.preventDefault();
    const touchX = e.touches[0].clientX;
    const diffX = touchX - this.touchStartX;
    
    // タッチ位置に応じてパドルを移動
    this.movePaddleToPosition(touchX);
    
    this.touchStartX = touchX;
  }
  
  /**
   * タッチ終了イベント処理
   */
  handleTouchEnd(e) {
    this.isTouching = false;
    this.paddle.dx = 0;
  }
  
  /**
   * マウス押下イベント処理
   */
  handleMouseDown(e) {
    this.isMouseDown = true;
    this.lastMouseX = e.clientX;
  }
  
  /**
   * マウス移動イベント処理
   */
  handleMouseMove(e) {
    if (!this.isMouseDown) return;
    
    const mouseX = e.clientX;
    const diffX = mouseX - this.lastMouseX;
    
    // マウス位置に応じてパドルを移動
    this.movePaddleToPosition(mouseX);
    
    this.lastMouseX = mouseX;
  }
  
  /**
   * マウスリリースイベント処理
   */
  handleMouseUp() {
    this.isMouseDown = false;
    this.paddle.dx = 0;
  }
  
  /**
   * 指定位置にパドルを移動
   */
  movePaddleToPosition(clientX) {
    // クライアント座標からキャンバス上の座標に変換
    const rect = this.canvas.getBoundingClientRect();
    const canvasX = clientX - rect.left;
    
    // パドルの中心がポインタの位置になるように設定
    this.paddle.x = canvasX - this.paddle.width / 2;
    
    // キャンバス内に収める
    if (this.paddle.x < 0) {
      this.paddle.x = 0;
    } else if (this.paddle.x + this.paddle.width > this.canvas.width) {
      this.paddle.x = this.canvas.width - this.paddle.width;
    }
  }
  
  /**
   * ゲームの開始
   */
  start() {
    if (!this.running) {
      this.running = true;
      this.gameLoop();
    }
  }
  
  /**
   * ゲームの一時停止/再開
   */
  togglePause() {
    this.paused = !this.paused;
    if (!this.paused) {
      this.gameLoop();
    }
  }
  
  /**
   * ゲームループ
   */
  gameLoop() {
    if (!this.running || this.paused) return;
    
    this.update();
    this.draw();
    
    requestAnimationFrame(this.gameLoop.bind(this));
  }
  
  /**
   * ゲーム状態の更新
   */
  update() {
    this.movePaddle();
    this.moveBall();
    this.checkCollision();
    this.checkGameStatus();
  }
  
  /**
   * パドルの移動
   */
  movePaddle() {
    this.paddle.x += this.paddle.dx;
    
    // 画面外に出ないように制限
    if (this.paddle.x < 0) {
      this.paddle.x = 0;
    } else if (this.paddle.x + this.paddle.width > this.canvas.width) {
      this.paddle.x = this.canvas.width - this.paddle.width;
    }
  }
  
  /**
   * ボールの移動
   */
  moveBall() {
    this.ball.x += this.ball.dx;
    this.ball.y += this.ball.dy;
    
    // 左右の壁との衝突判定
    if (this.ball.x - this.ball.radius < 0 || 
        this.ball.x + this.ball.radius > this.canvas.width) {
      this.ball.dx = -this.ball.dx;
      this.sound.playHit();
    }
    
    // 上の壁との衝突判定
    if (this.ball.y - this.ball.radius < 0) {
      this.ball.dy = -this.ball.dy;
      this.sound.playHit();
    }
    
    // 下の壁（ミス）
    if (this.ball.y + this.ball.radius > this.canvas.height) {
      this.sound.playLifeLost();
      this.onLifeLost();
      this.resetBall();
    }
  }
  
  /**
   * ボールのリセット
   */
  resetBall() {
    this.ball.x = this.canvas.width / 2;
    this.ball.y = this.canvas.height * 0.8;
    this.setInitialBallVelocity();
  }
  
  /**
   * 衝突判定
   */
  checkCollision() {
    // パドルとの衝突判定
    this.checkPaddleCollision();
    
    // ブロックとの衝突判定
    this.checkBlockCollision();
  }
  
  /**
   * パドルとの衝突判定
   */
  checkPaddleCollision() {
    if (this.ball.y + this.ball.radius > this.paddle.y &&
        this.ball.y - this.ball.radius < this.paddle.y + this.paddle.height &&
        this.ball.x > this.paddle.x &&
        this.ball.x < this.paddle.x + this.paddle.width) {
      
      // パドルのどの位置に当たったかで反射角度を変える
      const hitPosition = (this.ball.x - this.paddle.x) / this.paddle.width;
      const angle = (hitPosition - 0.5) * Math.PI / 2; // -π/4 から π/4 の範囲
      
      // ボールの速度を少し上げる（最大速度まで）
      this.ball.speed = Math.min(this.ball.speed * 1.05, this.ball.maxSpeed);
      
      this.ball.dx = this.ball.speed * Math.sin(angle);
      this.ball.dy = -this.ball.speed * Math.cos(angle);
      
      this.sound.playHit();
    }
  }
  
  /**
   * ブロックとの衝突判定
   */
  checkBlockCollision() {
    let allBlocksDestroyed = true;
    
    for (let r = 0; r < this.blockRows; r++) {
      for (let c = 0; c < this.blockCols; c++) {
        const block = this.blocks[r][c];
        
        if (block.visible) {
          allBlocksDestroyed = false;
          
          // ボールとブロックの衝突判定
          if (this.ball.x + this.ball.radius > block.x &&
              this.ball.x - this.ball.radius < block.x + block.width &&
              this.ball.y + this.ball.radius > block.y &&
              this.ball.y - this.ball.radius < block.y + block.height) {
            
            // 衝突方向の判定（簡易版）
            const overlapLeft = this.ball.x + this.ball.radius - block.x;
            const overlapRight = block.x + block.width - (this.ball.x - this.ball.radius);
            const overlapTop = this.ball.y + this.ball.radius - block.y;
            const overlapBottom = block.y + block.height - (this.ball.y - this.ball.radius);
            
            // 最小の重なりを見つけて、その方向に反射
            const minOverlap = Math.min(overlapLeft, overlapRight, overlapTop, overlapBottom);
            
            if (minOverlap === overlapLeft || minOverlap === overlapRight) {
              this.ball.dx = -this.ball.dx;
            } else {
              this.ball.dy = -this.ball.dy;
            }
            
            // ブロックの強度を減らす
            block.strength--;
            
            // ブロックが破壊されたかチェック
            if (block.strength <= 0) {
              block.visible = false;
              
              // スコア加算
              let points = 10;
              if (block.type === 'hard') {
                points = 30;
              } else if (block.type === 'power') {
                points = 50;
                // パワーアップ効果（将来の拡張用）
              }
              
              this.onScoreUpdate(points);
              
              // パーティクル効果
              this.particles.createParticles(
                block.x + block.width / 2,
                block.y + block.height / 2,
                this.getBlockColor(block.type)
              );
            }
            
            // 効果音
            this.sound.playHit();
            
            // 一度に1つのブロックとだけ衝突するようにする
            return;
          }
        }
      }
    }
    
    // すべてのブロックが破壊されたらレベルクリア
    if (allBlocksDestroyed) {
      this.running = false;
      this.onLevelClear();
    }
  }
  
  /**
   * ブロックタイプに応じた色を取得
   */
  getBlockColor(type) {
    switch (type) {
      case 'normal':
        return getComputedStyle(document.documentElement).getPropertyValue('--block-normal');
      case 'hard':
        return getComputedStyle(document.documentElement).getPropertyValue('--block-hard');
      case 'power':
        return getComputedStyle(document.documentElement).getPropertyValue('--block-power');
      default:
        return '#ffffff';
    }
  }
  
  /**
   * ゲーム状態のチェック
   */
  checkGameStatus() {
    // 将来的な拡張用（タイマーやスコア条件など）
  }
  
  /**
   * ゲーム画面の描画
   */
  draw() {
    // キャンバスのクリア
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    
    // パドルの描画
    this.drawPaddle();
    
    // ボールの描画
    this.drawBall();
    
    // ブロックの描画
    this.drawBlocks();
  }
  
  /**
   * パドルの描画
   */
  drawPaddle() {
    this.ctx.beginPath();
    this.ctx.roundRect(
      this.paddle.x,
      this.paddle.y,
      this.paddle.width,
      this.paddle.height,
      [this.paddle.height / 2]
    );
    this.ctx.fillStyle = getComputedStyle(document.documentElement).getPropertyValue('--paddle');
    this.ctx.fill();
    this.ctx.closePath();
  }
  
  /**
   * ボールの描画
   */
  drawBall() {
    this.ctx.beginPath();
    this.ctx.arc(this.ball.x, this.ball.y, this.ball.radius, 0, Math.PI * 2);
    this.ctx.fillStyle = getComputedStyle(document.documentElement).getPropertyValue('--ball');
    this.ctx.fill();
    this.ctx.closePath();
  }
  
  /**
   * ブロックの描画
   */
  drawBlocks() {
    for (let r = 0; r < this.blockRows; r++) {
      for (let c = 0; c < this.blockCols; c++) {
        const block = this.blocks[r][c];
        
        if (block.visible) {
          this.ctx.beginPath();
          this.ctx.roundRect(
            block.x,
            block.y,
            block.width,
            block.height,
            [4]
          );
          this.ctx.fillStyle = this.getBlockColor(block.type);
          this.ctx.fill();
          
          // 硬いブロックは模様を付ける
          if (block.type === 'hard') {
            this.ctx.beginPath();
            this.ctx.moveTo(block.x + block.width * 0.2, block.y + block.height * 0.2);
            this.ctx.lineTo(block.x + block.width * 0.8, block.y + block.height * 0.8);
            this.ctx.moveTo(block.x + block.width * 0.8, block.y + block.height * 0.2);
            this.ctx.lineTo(block.x + block.width * 0.2, block.y + block.height * 0.8);
            this.ctx.strokeStyle = 'rgba(255, 255, 255, 0.5)';
            this.ctx.lineWidth = 2;
            this.ctx.stroke();
          }
          
          // パワーアップブロックは光る効果
          if (block.type === 'power') {
            this.ctx.beginPath();
            this.ctx.arc(
              block.x + block.width / 2,
              block.y + block.height / 2,
              Math.min(block.width, block.height) * 0.3,
              0,
              Math.PI * 2
            );
            this.ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
            this.ctx.fill();
          }
          
          this.ctx.closePath();
        }
      }
    }
  }
  
  /**
   * リサイズ時の処理
   */
  resize(width, height) {
    // パドルのサイズと位置を調整
    const oldPaddleRatio = this.paddle.x / (this.canvas.width - this.paddle.width);
    this.paddle.width = width * 0.15;
    this.paddle.height = height * 0.02;
    this.paddle.x = oldPaddleRatio * (width - this.paddle.width);
    this.paddle.y = height * 0.9;
    this.paddle.speed = width * 0.01;
    
    // ボールのサイズと位置を調整
    const oldBallXRatio = this.ball.x / this.canvas.width;
    const oldBallYRatio = this.ball.y / this.canvas.height;
    this.ball.radius = Math.min(width, height) * 0.015;
    this.ball.x = oldBallXRatio * width;
    this.ball.y = oldBallYRatio * height;
    
    // 速度の調整
    const speedRatio = height / this.canvas.height;
    this.ball.dx *= speedRatio;
    this.ball.dy *= speedRatio;
    this.ball.speed *= speedRatio;
    this.ball.maxSpeed = height * 0.015;
    
    // ブロックの再配置
    this.blockOffsetTop = height * 0.1;
    this.blockOffsetLeft = width * 0.05;
    
    const blockWidth = (width * 0.9 - this.blockPadding * (this.blockCols + 1)) / this.blockCols;
    const blockHeight = height * 0.04;
    
    for (let r = 0; r < this.blockRows; r++) {
      for (let c = 0; c < this.blockCols; c++) {
        const block = this.blocks[r][c];
        block.x = this.blockOffsetLeft + c * (blockWidth + this.blockPadding);
        block.y = this.blockOffsetTop + r * (blockHeight + this.blockPadding);
        block.width = blockWidth;
        block.height = blockHeight;
      }
    }
  }
}
