// app/checkout/success/page.jsx
import React, { Suspense } from 'react'

// this file is *implicitly* a server component,
// so you don't put `"use client"` at the top

export default function Page() {
  return (
    <Suspense fallback={<div>Chargement de la page de succès…</div>}>
      {/* 
        Dynamically import your client-only component 
        (you can also just import it normally; next will code-split it)
      */}
      <ClientSuccessPage />
    </Suspense>
  )
}

// lazy-load the client component to keep this a pure server file
const ClientSuccessPage = React.lazy(() => import('./ClientSuccessPage'))
