// app/checkout/error/page.jsx
import React, { Suspense } from 'react'

// this file is *implicitly* a server component,
// so you don't put `"use client"` at the top

export default function Page() {
  return (
    <Suspense fallback={<div>Chargement de la page d’erreur…</div>}>
      {/* 
        Dynamically import your client-only component 
        (you can also just import it normally; next will code-split it)
      */}
      <ClientErrorPage />
    </Suspense>
  )
}

// lazy-load the client component to keep this a pure server file
const ClientErrorPage = React.lazy(() => import('./ClientErrorPage'))
