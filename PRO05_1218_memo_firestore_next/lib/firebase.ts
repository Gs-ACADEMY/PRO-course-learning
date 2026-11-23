import { getApps, initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// Firebase コンソール →（歯車）プロジェクトの設定 → マイアプリ →「SDK の設定と構成」の「構成」を、そのまま貼る。
// この値は秘密ではない（どのプロジェクトにつなぐかを示す名札）。データを守るのは Firestore のセキュリティルール
const firebaseConfig = {
  apiKey: "ここに貼る",
  authDomain: "ここに貼る",
  projectId: "ここに貼る",
  storageBucket: "ここに貼る",
  messagingSenderId: "ここに貼る",
  appId: "ここに貼る",
};

// 開発中に何度読み込まれても、つなぐのは 1 回だけ
const app = getApps()[0] ?? initializeApp(firebaseConfig);

/** 借りるデータベース（Firestore） */
export const db = getFirestore(app);
