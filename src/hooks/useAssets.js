import { useState, useEffect } from 'react'
import {
  collection, onSnapshot, addDoc, updateDoc, deleteDoc, doc
} from 'firebase/firestore'
import { db } from '../firebase'

const COL = collection(db, 'assets')

export function useAssets() {
  const [assets, setAssets] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const unsub = onSnapshot(COL, snap => {
      setAssets(snap.docs.map(d => ({ id: d.id, ...d.data() })))
      setLoading(false)
    })
    return unsub
  }, [])

  const addAsset = async (asset) => {
    const ref = await addDoc(COL, { ...asset, createdAt: new Date().toISOString() })
    return { id: ref.id, ...asset }
  }

  const updateAsset = async (id, updates) => {
    await updateDoc(doc(db, 'assets', id), updates)
  }

  const deleteAsset = async (id) => {
    await deleteDoc(doc(db, 'assets', id))
  }

  const getAsset = (id) => assets.find(a => a.id === id)

  return { assets, loading, addAsset, updateAsset, deleteAsset, getAsset }
}
