"use client"

import { useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { useCart } from "@/app/CartContext"
import styles from "./styles.module.css"

export default function CheckoutSuccessPage() {
  const router       = useRouter()
  const searchParams = useSearchParams()
  const { clearCart } = useCart()

  const [order,  setOrder]  = useState(null)
  const [loading,setLoading] = useState(true)
  const [error,  setError]   = useState(null)

  const orderId = searchParams.get("order_id")

  const formatCurrency = (amt) =>
    new Intl.NumberFormat("fr-FR", {
      style: "currency",
      currency: "XOF",
      minimumFractionDigits: 0,
    }).format(amt)

  useEffect(() => {
    if (!orderId) {
      setError("Aucun identifiant de commande fourni.")
      setLoading(false)
      return
    }

    const fetchOrder = async () => {
      try {
        const res = await fetch(`/api/orders/${orderId}`)
        if (!res.ok) throw new Error(`HTTP ${res.status}`)
        const orderData = await res.json()
        setOrder(orderData)            // <-- raw row
        clearCart()
      } catch (err) {
        console.error("Erreur récupération commande :", err)
        setError("Impossible de récupérer votre commande.")
      } finally {
        setLoading(false)
      }
    }

    fetchOrder()
  }, [orderId, clearCart])

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