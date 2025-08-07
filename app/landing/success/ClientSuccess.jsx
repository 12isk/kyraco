'use client'
import { useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'

export default function ThankYou() {
  const params     = useSearchParams()
  const donationId = params.get('donationId')      // from your router.push
  const [status, setStatus] = useState('Vérification…')

  // fetch the Wave session ID from your DB
  async function getWaveSessionId(donationId) {
    const res = await fetch(`/api/donations/search?id=${donationId}`)
    if (!res.ok) throw new Error(`Erreur: ${res.statusText}`)
    const { donation } = await res.json()
    return donation.wave_session_id
  }

  useEffect(() => {
    if (!donationId) {
      setStatus("Aucun don spécifié.")
      return
    }
    // wrap async work in a function
    async function verify() {
      try {
        const waveSessionId = await getWaveSessionId(donationId)
        if (!waveSessionId) {
          setStatus("Impossible de récupérer la session Wave.")
          return
        }
        const res = await fetch(
          `/api/donations/verify?session_id=${waveSessionId}`
        )
        if (!res.ok) throw new Error(res.statusText)
        const { complete } = await res.json()
        setStatus(
          complete
            ? 'Votre don est confirmé ! 🎉'
            : 'En attente de confirmation…'
        )
      } catch (err) {
        console.error(err)
        setStatus('Erreur lors de la vérification.')
      }
    }
    verify()
  }, [donationId])

  return (
    <div style={{ padding: '2rem', textAlign: 'center' }}>
      <h1>Merci !</h1>
      <p>{status}</p>
    </div>
  )
}
