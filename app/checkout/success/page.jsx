// app/checkout/success/page.jsx
"use client"

import { useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { useCart } from "@/app/CartContext"
import styles from "./styles.module.css"

export default function CheckoutSuccessPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { clearCart } = useCart()

  const [order, setOrder] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

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
        const json = await res.json()
        setOrder(json.order)
        // once we have it, clear the cart
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
        {/* Success Icon */}
        <div className={styles.iconContainer}>
          <div className={styles.successIcon}>
            <svg width="64" height="64" viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="12" r="10" fill="#10B981" />
              <path d="m9 12 2 2 4-4"
                    stroke="white" strokeWidth="2"
                    strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
        </div>

        {/* Confirmation message */}
        <div className={styles.messageSection}>
          <h1 className={styles.title}>Commande confirmée !</h1>
          <p className={styles.subtitle}>
            Merci pour votre achat. Votre commande a bien été enregistrée.
          </p>
        </div>

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
              <span className={styles.statusBadge}>
                {order.payment_status}
              </span>
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
            {order.items.map((item) => (
              <div key={item.id} className={styles.item}>
                <div className={styles.itemImageContainer}>
                  <img
                    src={item.image || "/placeholder.svg"}
                    alt={item.name}
                    className={styles.itemImage}
                  />
                  <span className={styles.itemQuantity}>×{item.quantity}</span>
                </div>
                <div className={styles.itemDetails}>
                  <div className={styles.itemName}>{item.name}</div>
                  {item.variant && (
                    <div className={styles.itemVariant}>{item.variant}</div>
                  )}
                </div>
                <div className={styles.itemPrice}>
                  {formatCurrency(item.price * item.quantity)}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Next steps */}
        <div className={styles.nextSteps}>
          <h3 className={styles.sectionTitle}>Prochaines étapes</h3>
          <ol className={styles.stepsList}>
            <li className={styles.step}>
              <strong>Confirmation par email</strong>  
              Vous recevrez un email avec les détails de la commande.
            </li>
            <li className={styles.step}>
              <strong>Préparation</strong>  
              Votre commande sera préparée et expédiée sous 24-48 heures.
            </li>
            <li className={styles.step}>
              <strong>Livraison</strong>  
              Vous recevrez un numéro de suivi pour suivre votre colis.
            </li>
          </ol>
        </div>

        {/* Actions */}
        <div className={styles.actions}>
          <button
            className={styles.primaryButton}
            onClick={() => router.push("/")}
          >
            Continuer mes achats
          </button>
          <button
            className={styles.secondaryButton}
            onClick={() => window.print()}
          >
            Imprimer la confirmation
          </button>
        </div>
      </div>
    </div>
  )
}
