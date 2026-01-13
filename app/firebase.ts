import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// 您的 Firebase 設定
const firebaseConfig = {
  apiKey: "AIzaSyBNcVip23EJ-wRbVtyG2o3_WgvZEWF9ivI",
  authDomain: "ok-schedule.firebaseapp.com",
  projectId: "ok-schedule",
  storageBucket: "ok-schedule.firebasestorage.app",
  messagingSenderId: "715643626299",
  appId: "1:715643626299:web:08021bcce9f5f0bdcb8d1e"
};

// 初始化 Firebase (防止在 Next.js 開發環境中重複初始化)
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

// 初始化 Firestore 資料庫服務
const db = getFirestore(app);

// 匯出 db 供 page.tsx 使用
export { db };