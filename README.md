# ブロック崩し (Breakout Game)

HTML5 Canvas と JavaScript を使用した、クラシックなブロック崩しゲームです。PC とモバイルの両方で遊べるレスポンシブ対応のブラウザゲームです。

## 遊び方

1. 「プレイ開始」ボタンをクリックしてゲームを始めます
2. **PC での操作**: キーボードの左右矢印キー（← →）でパドルを動かします
3. **スマートフォンでの操作**: 画面をタップまたはスワイプしてパドルを動かします
4. ボールを落とさないようにパドルで弾き返しながら、上部のブロックを全て破壊しましょう
5. ブロックを破壊するとスコアが加算されます
   - 通常ブロック: +10 点
   - 硬いブロック (2回ヒットで破壊): +30 点
   - パワーアップブロック: +50 点
6. ボールを落とすとライフが 1 つ減ります
7. ライフが 0 になるとゲームオーバーです
8. 全てのブロックを破壊するとステージクリアです

## 改造ポイント

このゲームは拡張性を考慮して設計されています。以下のポイントでカスタマイズが可能です：

### 1. 新しいステージの追加

`game.js` の `createBlocks` メソッドを編集することで、レベルごとに異なるブロック配置を実装できます。

```javascript
createBlocks() {
  // レベルに応じた条件分岐を追加
  if (this.level === 1) {
    // レベル1のブロック配置
  } else if (this.level === 2) {
    // レベル2のブロック配置
  }
}
```

### 2. パワーアップアイテムの追加

`game.js` に新しいパワーアップ効果を実装できます。例えば：

- パドルの拡大/縮小
- ボールのスピード変更
- マルチボール
- 貫通ボール

### 3. 見た目のカスタマイズ

`css/style.css` の `:root` セクションで色を変更できます：

```css
:root {
  --background: #0a1128;
  --text: #ffffff;
  --paddle: #4cc9f0;
  /* 他の色を変更 */
}
```

### 4. 効果音の変更

`sounds` ディレクトリ内のMP3ファイルを置き換えることで、効果音をカスタマイズできます。

## ファイル構成

- `index.html` - メインHTML
- `css/style.css` - スタイルシート
- `js/main.js` - メインエントリーポイント
- `js/game.js` - ゲームロジック
- `js/ui.js` - UI管理
- `js/sound.js` - サウンド管理
- `js/effects.js` - エフェクト（パーティクル）
- `sounds/` - 効果音ファイル

## ライセンス

MIT License

Copyright (c) 2025 Hiroki Emueshi

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
