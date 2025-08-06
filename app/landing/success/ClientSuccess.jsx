// app/landing/success/page.jsx
'use client'
import { useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'

export default function ThankYou() {
  const params = useSearchParams()
  const sessionId = params.get('session_id')
  const [status, setStatus] = useState('Vérification…')

  useEffect(() => {
    if (!sessionId) return
    fetch(`/api/donations/verify?session_id=${sessionId}`)
      .then(r=>r.json())
      .then(j=> {
        setStatus(j.complete
          ? 'Votre don est confirmé ! 🎉'
          : 'En attente de confirmation…')
      })
  }, [sessionId])

  return (
    <div style={{ padding:'2rem', textAlign:'center' }}>
      <h1>Merci !</h1>
      <p>{status}</p>
    </div>
  )
}
