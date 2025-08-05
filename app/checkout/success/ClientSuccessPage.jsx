// "use client"

// import { useEffect, useState } from "react"
// import { useRouter, useSearchParams } from "next/navigation"
// import { useCart } from "@/app/CartContext"
// import styles from "./styles.module.css"

// export default function CheckoutSuccessPage() {
//   const router       = useRouter()
//   const searchParams = useSearchParams()
//   const { clearCart } = useCart()

//   const [order,  setOrder]  = useState(null)
//   const [loading,setLoading] = useState(true)
//   const [error,  setError]   = useState(null)

//   const orderId = searchParams.get("order_id")

//   const formatCurrency = (amt) =>
//     new Intl.NumberFormat("fr-FR", {
//       style: "currency",
//       currency: "XOF",
//       minimumFractionDigits: 0,
//     }).format(amt)

//   // useEffect(() => {
//   //   if (!orderId) {
//   //     setError("Aucun identifiant de commande fourni.")
//   //     setLoading(false)
//   //     return
//   //   }

//   //   const fetchOrder = async () => {
//   //     try {
//   //       const res = await fetch(`/api/orders/${orderId}`)
//   //       if (!res.ok) throw new Error(`HTTP ${res.status}`)
//   //       const orderData = await res.json()
//   //       setOrder(orderData)            // <-- raw row
//   //       clearCart()
//   //     } catch (err) {
//   //       console.error("Erreur récupération commande :", err)
//   //       setError("Impossible de récupérer votre commande.")
//   //     } finally {
//   //       setLoading(false)
//   //     }
//   //   }

//   //   fetchOrder()
//   // }, [orderId, clearCart])
// useEffect(() => {
//   if (!orderId) {
//     console.error("No orderId provided");
//     setError("Aucun identifiant de commande fourni.");
//     setLoading(false);
//     return;
//   }

//   async function fetchOrder() {
//     const url = `/api/orders/${orderId}`;
//     console.log("⏳ Fetching order from:", url);

//     try {
//       const res = await fetch(url);
//       console.log("📥 Raw response:", res);

//       const text = await res.text();
//       console.log("📑 Response text:", text);

//       if (!res.ok) {
//         throw new Error(`HTTP ${res.status}`);
//       }

//       // If your API returns `{ order: {...} }` vs. the row itself, log that too:
//       const json = JSON.parse(text);
//       console.log("🗃️ Parsed JSON:", json);

//       // either
//       setOrder(json.order || json);
//       clearCart();
//     } catch (err) {
//       console.error("❌ Erreur récupération commande :", err);
//       setError("Impossible de récupérer votre commande.");
//     } finally {
//       setLoading(false);
//     }
//   }

//   fetchOrder();
// }, [orderId, clearCart]);

'use client'
import { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useCart } from '@/app/CartContext'
import styles from './styles.module.css'

export default function CheckoutSuccessPage() {
  const router       = useRouter()
  const searchParams = useSearchParams()
  const { cart, clearCart } = useCart()

  const [order,  setOrder]   = useState(null)
  const [loading,setLoading] = useState(true)
  const [error,  setError]   = useState(null)

  const orderId = searchParams.get('order_id')

  const formatCurrency = amt =>
    new Intl.NumberFormat('fr-FR', {
      style: 'currency', currency: 'XOF', minimumFractionDigits: 0
    }).format(amt)

  useEffect(() => {
    if (!orderId) {
      setError('Aucun identifiant de commande fourni.')
      setLoading(false)
      return
    }

    async function finalizeAndFetch() {
      try {
        // Retrieve Wave session
        const session = JSON.parse(localStorage.getItem('checkout_session'))
        if (!session) throw new Error('Pas de session de paiement trouvée.')

        // Finalize order on backend
        await fetch('/api/orders', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            orderId,
            items: cart.map(i => ({
              id: i.id, name: i.name, variant: i.variant || null,
              price: i.price, quantity: i.quantity
            })),
            total:         session.amount,
            wavePaymentId: session.payment_id,
            notes:         '',
            succeeded:     true
          })
        })

        // Fetch completed order
        const res  = await fetch(`/api/orders/${orderId}`)
        if (!res.ok) throw new Error(`HTTP ${res.status}`)
        const json = await res.json()
        setOrder(json.order || json)

        // Cleanup
        clearCart()
        localStorage.removeItem('checkout_session')
        localStorage.removeItem('checkout_orderId')
      } catch (err) {
        console.error(err)
        setError('Impossible de finaliser ou récupérer la commande.')
      } finally {
        setLoading(false)
      }
    }

    finalizeAndFetch()
  }, [orderId, cart, clearCart])

  if (loading) {
    return (
      <div className={styles.container}>
        <div className={styles.loadingSpinner}>
          <div className={styles.spinner}></div>
          <p>Chargement de votre confirmation…</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className={styles.container}>
        <p className={styles.errorMessage}>{error}</p>
        <button onClick={() => router.push("/")} className={styles.primaryButton}>
          Retour à l’accueil
        </button>
      </div>
    )
  }

  return (
    <div className={styles.container}>
      <div className={styles.successContent}>
        {/* … your existing success UI … */}

        {/* Order details */}
        <div className={styles.orderDetails}>
          <div className={styles.orderInfo}>
            <div className={styles.infoRow}>
              <span className={styles.label}>Numéro de commande</span>
              <span className={styles.value}>{order.id}</span>
            </div>
            <div className={styles.infoRow}>
              <span className={styles.label}>Montant total</span>
              <span className={styles.value}>{formatCurrency(order.total)}</span>
            </div>
            <div className={styles.infoRow}>
              <span className={styles.label}>Statut paiement</span>
              <span className={styles.statusBadge}>{order.payment_status}</span>
            </div>
            <div className={styles.infoRow}>
              <span className={styles.label}>Date</span>
              <span className={styles.value}>
                {new Date(order.created_at).toLocaleDateString("fr-FR")}
              </span>
            </div>
          </div>
        </div>

        {/* Items */}
        <div className={styles.itemsSection}>
          <h3 className={styles.sectionTitle}>Articles</h3>
          <div className={styles.items}>
            {order.items?.map((item) => (
              <div key={item.id} className={styles.item}>
                {/* … */}
              </div>
            ))}
          </div>
        </div>

        {/* … rest of your UI … */}
      </div>
    </div>
  )
}