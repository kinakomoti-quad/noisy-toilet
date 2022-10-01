# 環境設定とか
## nodejsインストール
aptで取得するnodejsのバージョンが古いので、手動でwebページから落としてくるのが確実です
## npm準備
```
npm install
```
一回のみ
## npm実行
```
npm start
```

- これで動くはず
- nodejsがうまく動かなかった場合、とりあえずindex.htmlを開けばprocessingの動作は確認できます。renderer.jsをwebのp5.jsエディタにコピペしても見れます。
## 音声ファイル準備
- 以下のサイトから素材を落とし、"sound-wash.mp3"に名前を変えてsoundフォルダに放り込む
- https://dova-s.jp/se/play166.html

## 起動後
- アプリの終了
ctrl + W (cmd + W)

## 各種設定
- main.js
  - fullscreen フルスクリーン表示制御

- renderer.js 描画・通信関係
  - debug_mode オンにすると各種パラメータが表示されるようになる。音声入力や色の調整等にどうぞ
  - port シリアル通信の制御。pathを適切に設定する必要あり
  - class circle 泡の描画設定。色の設定とかはここを触る

## 参考サイト
https://qiita.com/mathrax-s/items/83aa9783e717b9eae5b4
