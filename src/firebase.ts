'use client'
// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'

const firebaseConfig = {
  apiKey: "AIzaSyDCgqORU1nHN7Hi7vyTCuMD_R3l-BptHGY",
  authDomain: "hrbio-fd338.firebaseapp.com",
  projectId: "hrbio-fd338",
  storageBucket: "hrbio-fd338.appspot.com",
  messagingSenderId: "893765682545",
  appId: "1:893765682545:web:4fa4a83d9d46a0601ea2d0"
}

// Initialize Firebase
export const firebaseApp = initializeApp(firebaseConfig)
export const auth = getAuth(firebaseApp)
export const db = getFirestore(firebaseApp)
