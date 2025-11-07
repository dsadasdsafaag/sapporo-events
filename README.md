# Today in Sapporo (MVP)

- 無料API（OSM）で **一覧⇄地図の双方向同期** を実装
- 「今日 / 今週末 / 来週」フィルタ、カテゴリ色、凡例つき
- GitHub Actionsで `next export` → GitHub Pages 自動公開
- データは `data/events.json` を編集するだけ

## 使い方
1. `data/events.json` にイベントを追記
2. カテゴリは `festival | indoor | learn | other`
3. 反映は push だけでOK（Actionsで自動デプロイ）

## タイルについて
- 初期は `https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png` を使用
- アクセスが増えたら、MapTiler/自前タイルの利用を検討してください（利用規約順守）

## ライセンス/帰属
- © OpenStreetMap contributors
- 各イベント情報の出典は各公式サイトに従う
