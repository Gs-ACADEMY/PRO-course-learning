# PRO05_1218 お天気アプリを Next.js に組み込んだ見本（V4 の講師の見本）

12/18 の素材 1218-2（今日の天気と出典の表示）と、12/18 テーマⅠの実演で使う見本です。
PRO04_1215_memo_next のメモ帳に、お天気（Open-Meteo）を部品として組み込んでいます。

## 12/18 のスライドとの対応

| スライドの言葉 | このプロジェクト |
|---|---|
| 返り値の型（Forecast） | `lib/weather.ts` の `Forecast`・`fetchForecast(): Promise<Forecast>` |
| 3 つの状態を 1 つの型に | `lib/weather.ts` の `WeatherState`（loading ／ success: data ／ error: message） |
| 表示の部品：status ごとに書き分ける | `components/WeatherView.tsx`（switch と、最後の `never`） |
| 失敗の表示を消すと赤線 | `WeatherView.tsx` の `case "error":` を消すと、`const rest: never = state;` に赤線（素材 1218-3） |
| 出典の表示 | `components/WeatherCard.tsx` の「Weather data by Open-Meteo.com」 |

## 動かし方

```bash
npm install
npm run dev     # http://localhost:3000
```

画面を開くと天気を 1 回読みます。失敗の表示は、`lib/weather.ts` の URL をわざと壊すと見られます。

## 素材 1218-2 の撮り方について

この作業の環境からは Open-Meteo に直接つながらなかったため、ブラウザで 10/11 08:30 に取った**実際の返り値**を、撮影のときだけ同じ URL の応答として返しています（画面の「10/11 08:30 時点」はその時刻）。
手元の PC で `npm run dev` すれば、その時点の本当の天気が出ます。講義の前に撮り直すと、日付も講義に近くなります。

## メモ

- Open-Meteo の利用条件（鍵なし・非商用・1 日 1 万回未満・出典の表示）は 10/10 に確認した内容。講義の前日にもう一度確かめる
- メモ帳の部分（`components/Memo*.tsx`）は PRO04_1215_memo_next と同じです
