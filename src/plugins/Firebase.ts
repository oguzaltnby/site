// plugins/firebase.ts
import { initializeApp } from 'firebase/app'
import { getFirestore, collection, query, where, orderBy, limit, getDocs, Timestamp } from 'firebase/firestore'
import type { Song } from '~/types/song'

const firebaseConfig = {
  apiKey: 'API_KEY',
  authDomain: 'xxx.firebaseapp.com',
  projectId: 'xxx',
  storageBucket: 'xxx.appspot.com',
  messagingSenderId: 'xxx',
  appId: 'xxx'
}

const app = initializeApp(firebaseConfig)
const db = getFirestore(app)

export default defineNuxtPlugin((nuxtApp) => {
  async function getDaily(getTurkeyTime: () => Date, limitNum: number = 1): Promise<Song | Song[]> {
    const q = query(
      collection(db, 'dailySongs'),
      where('date', '<=', getTurkeyTime()),
      orderBy('date', 'desc'),
      limit(limitNum)
    )

    const snapshots = await getDocs(q)
    const docs: Song[] = []

    snapshots.forEach((doc) => {
      const { date, url, metadata, spotifyUrl } = doc.data() as any

      docs.push({
        date: (date as Timestamp).toDate(),
        url,
        metadata,
        spotifyUrl,
      })
    })

    return docs.length === 1 ? docs[0] : docs
  }

  nuxtApp.provide('getDaily', getDaily)
})
