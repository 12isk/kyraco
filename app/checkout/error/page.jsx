// app/checkout/error/page.jsx
"use client"

import { useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { useCart } from "@/app/CartContext"
import styles from "./styles.module.css"

export default function CheckoutErrorPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { clearCart } = useCart()

  const [loading, setLoading] = useState(true)
  const [fetchError, setFetchError] = useState(null)
  const [order, setOrder] = useState(null)
  const [errorDetails, setErrorDetails] = useState({
    type:    "payment_failed",
    message: "Le paiement n'a pas pu être traité",
    code:    "PAYMENT_ERROR",
  })

  useEffect(() => {
    // 1️⃣ Parse URL params
    const type    = searchParams.get("error")   || "payment_failed"
    const message = searchParams.get("message") || "Une erreur est survenue"
    const code    = searchParams.get("code")    || "UNKNOWN_ERROR"
    const orderId = searchParams.get("order_id")

    setErrorDetails({ type, message, code })

    if (!orderId) {
      setFetchError("Aucun identifiant de commande fourni.")
      setLoading(false)
      return
    }

    // 2️⃣ Fetch the saved order from your API
    fetch(`/api/orders/${orderId}`)
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`)
        return res.json()
      })
      .then((json) => {
        setOrder(json.order)
        clearCart()
      })
      .catch((err) => {
        console.error("Erreur fetch order:", err)
        setFetchError("Impossible de récupérer votre commande.")
      })
      .finally(() => setLoading(false))
  }, [searchParams, clearCart])

  const formatCurrency = (amt) =>
    new Intl.NumberFormat("fr-FR", {
      style: "currency",
      currency: "XOF",
      minimumFractionDigits: 0,
    }).format(amt)

  function getErrorIcon() {
    switch (errorDetails.type) {
      case "payment_failed":
        return (
          <svg width="64" height="64" viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="12" r="10" fill="#EF4444" />
            <path d="m15 9-6 6m0-6 6 6"
                  stroke="white" strokeWidth="2"
                  strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        )
      case "network_error":
        return (
          <svg width="64" height="64" viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="12" r="10" fill="#F59E0B" />
            <path d="M12 8v4m0 4h.01"
                  stroke="white" strokeWidth="2"
                  strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        )
      default:
        return (
          <svg width="64" height="64" viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="12" r="10" fill="#6B7280" />
            <path d="M12 8v4m0 4h.01"
                  stroke="white" strokeWidth="2"
                  strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        )
    }
  }

  function getErrorTitle() {
    switch (errorDetails.type) {
      case "payment_failed":   return "Paiement échoué"
      case "network_error":    return "Problème de connexion"
      case "session_expired":  return "Session expirée"
      default:                 return "Erreur de traitement"
    }
  }

  function getErrorDescription() {
    switch (errorDetails.type) {
      case "payment_failed":
        return "Votre paiement n'a pas pu être traité. Vérifiez vos infos et réessayez."
      case "network_error":
        return "Erreur de connexion. Vérifiez votre réseau et réessayez."
      case "session_expired":
        return "Votre session a expiré. Veuillez recommencer la commande."
      default:
        return "Une erreur inattendue est survenue lors du traitement de votre commande."
    }
  }

  function getSolutions() {
    switch (errorDetails.type) {
      case "payment_failed":
        return [
          "Vérifiez que votre numéro Wave est correct",
          "Assurez-vous d'avoir suffisamment de fonds",
          "Contactez votre opérateur si le problème persiste",
        ]
      case "network_error":
        return [
          "Vérifiez votre connexion internet",
          "Actualisez la page et réessayez",
          "Essayez un autre navigateur",
        ]
      default:
        return [
          "Actualisez la page et réessayez",
          "Vérifiez votre connexion internet",
          "Contactez le support si nécessaire",
        ]
    }
  }

  if (loading) {
    return (
      <div className={styles.container}>
        <div className={styles.loadingSpinner}>
          <div className={styles.spinner}></div>
          <p>Chargement…</p>
        </div>
      </div>
    )
  }

  if (fetchError) {
    return (
      <div className={styles.container}>
        <p className={styles.errorMessage}>{fetchError}</p>
        <button
          className={styles.primaryButton}
          onClick={() => router.push("/")}
        >
          Retour à l’accueil
        </button>
      </div>
    )
  }

  return (
    <div className={styles.container}>
      <div className={styles.errorContent}>
        {/* Error Icon */}
        <div className={styles.iconContainer}>
          <div className={styles.errorIcon}>{getErrorIcon()}</div>
        </div>

        {/* Error Title & Description */}
        <div className={styles.messageSection}>
          <h1 className={styles.title}>{getErrorTitle()}</h1>
          <p className={styles.subtitle}>{getErrorDescription()}</p>
        </div>

        {/* Error Details */}
        <div className={styles.errorDetails}>
          <div className={styles.infoRow}>
            <span className={styles.label}>Code d'erreur</span>
            <span className={styles.errorCode}>{errorDetails.code}</span>
          </div>
          <div className={styles.infoRow}>
            <span className={styles.label}>Message</span>
            <span className={styles.value}>{errorDetails.message}</span>
          </div>
        </div>

        {/* Order Summary */}
        <div className={styles.orderSummary}>
          <h3 className={styles.sectionTitle}>Votre commande</h3>
          <div className={styles.infoRow}>
            <span className={styles.label}>Numéro</span>
            <span className={styles.value}>{order.id}</span>
          </div>
          <div className={styles.infoRow}>
            <span className={styles.label}>Total</span>
            <span className={styles.value}>{formatCurrency(order.total)}</span>
          </div>
          <div className={styles.itemsSection}>
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

        {/* Suggested Solutions */}
        <div className={styles.solutionsSection}>
          <h3 className={styles.sectionTitle}>Solutions suggérées</h3>
          {getSolutions().map((s, i) => (
            <div key={i} className={styles.solution}>
              <div className={styles.solutionNumber}>{i + 1}</div>
              <div className={styles.solutionText}>{s}</div>
            </div>
          ))}
        </div>

        {/* Actions */}
        <div className={styles.actions}>
          <button
            className={styles.primaryButton}
            onClick={() => router.push("/checkout")}
          >
            Réessayer le paiement
          </button>
          <button
            className={styles.secondaryButton}
            onClick={() => router.push("/")}
          >
            Retour à l’accueil
          </button>
        </div>
      </div>
    </div>
  )
}
