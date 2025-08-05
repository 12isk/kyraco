"use client"

import { useState } from "react"
import { useCart } from "@/app/CartContext"
import styles from "./styles.module.css"
import { useRouter } from "next/navigation"

export default function CheckoutPage() {
  const { cart } = useCart()

  // ▶️ State for grouped fields
  const [email, setEmail] = useState("")
  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")
  const [phone, setPhone] = useState("")
  const [address, setAddress] = useState("")
  const [suite, setSuite] = useState("")
  const [city, setCity] = useState("")
  const [saveInfo, setSaveInfo] = useState(false)

  const [paymentMethod, setPaymentMethod] = useState("wave")

  // ❌ COMMENTED OUT: Card payment fields
  // const [cardNumber, setCardNumber] = useState("");
  // const [cardExpiry, setCardExpiry] = useState("");
  // const [cardCVC, setCardCVC] = useState("");
  // const [nameOnCard, setNameOnCard] = useState("");
  // const [useBillingAddress, setUseBillingAddress] = useState(true);

  // Wave payment fields
  const [waveCountryCode, setWaveCountryCode] = useState("+225")
  const [wavePhone, setWavePhone] = useState("")
  const [discountCode, setDiscountCode] = useState("")

  // totals
  const subtotal = cart.reduce((sum, i) => sum + i.price * i.quantity, 0)
  const total = subtotal

  const formatCurrency = (amt) =>
    new Intl.NumberFormat("fr-FR", {
      style: "currency",
      currency: "XOF",
      minimumFractionDigits: 0,
    }).format(amt)

  const router = useRouter()

  // Format phone number with spaces (01 02 03 04 05)
  const formatPhoneNumber = (value) => {
    // Remove all non-digits
    const digits = value.replace(/\D/g, "")
    // Add spaces every 2 digits
    return digits.replace(/(\d{2})(?=\d)/g, "$1 ").trim()
  }

  const handleWavePhoneChange = (e) => {
    const formatted = formatPhoneNumber(e.target.value)
    if (formatted.replace(/\s/g, "").length <= 10) {
      setWavePhone(formatted)
    }
  }

  async function handlePayButton() {
    const data = {
      email,
      firstName,
      lastName,
      phone,
      address,
      suite,
      city,
      paymentMethod,
      // ❌ COMMENTED OUT: Card data
      // card: { cardNumber, cardExpiry, cardCVC, nameOnCard },
      wavePhone: waveCountryCode + wavePhone.replace(/\s/g, ""),
      discountCode,
      saveInfo,
      // useBillingAddress, // ❌ COMMENTED OUT
      subtotal,
      total,
    }

    console.log("Checkout payload:", data)

    if (paymentMethod === "wave") {
      try {
        // 1) create a new session on your server
        const res = await fetch("/api/checkout", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            amount: cart.reduce((sum, i) => sum + i.price * i.quantity, 0),
            phoneNumber: waveCountryCode + wavePhone.replace(/\s/g, ""),
            // whatever you collect
          }),
        })

        const session = await res.json()
        if (!res.ok) throw new Error(session.error || "Erreur de création de session")

        // 2) redirect the browser to Wave's payment page
        router.push(session.wave_launch_url)
      } catch (err) {
        console.error(err)
        alert("Impossible de lancer le paiement : " + err.message)
      }
    }
  }

  return (
    <div className={styles.checkout}>
      {/* Left Column - Form */}
      <div className={styles.formContainer}>
        {/* Contact Section */}
        <div className={styles.section}>
          <div className={styles.sectionHeader}>
            <h2>Informations personnelles</h2>
          </div>

          <div className={styles.inputGroup}>
            <label htmlFor="email" className={styles.label}>
              Adresse email *
            </label>
            <input
              id="email"
              type="email"
              placeholder="votre@email.com"
              className={styles.input}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              aria-describedby="email-error"
            />
          </div>

          <div className={styles.inputRow}>
            <div className={styles.inputGroup}>
              <label htmlFor="firstName" className={styles.label}>
                Prénom *
              </label>
              <input
                id="firstName"
                type="text"
                placeholder="Prénom"
                className={styles.input}
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                required
                aria-describedby="firstName-error"
              />
            </div>
            <div className={styles.inputGroup}>
              <label htmlFor="lastName" className={styles.label}>
                Nom de famille *
              </label>
              <input
                id="lastName"
                type="text"
                placeholder="Nom de famille"
                className={styles.input}
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                required
                aria-describedby="lastName-error"
              />
            </div>
          </div>

          <div className={styles.inputGroup}>
            <label htmlFor="phone" className={styles.label}>
              Téléphone *
            </label>
            <input
              id="phone"
              type="tel"
              placeholder="+225 01 02 03 04 05"
              className={styles.input}
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              required
              aria-describedby="phone-error"
            />
          </div>

          <div className={styles.checkbox}>
            <input type="checkbox" id="saveInfo" checked={saveInfo} onChange={(e) => setSaveInfo(e.target.checked)} />
            <label htmlFor="saveInfo">Enregistrer ces infos pour la prochaine fois</label>
          </div>
        </div>

        {/* Delivery Section */}
        <div className={styles.section}>
          <h2>Adresse de livraison</h2>

          <div className={styles.inputGroup}>
            <label htmlFor="country" className={styles.label}>
              Pays
            </label>
            <input
              id="country"
              type="text"
              className={styles.input}
              value="Côte d'Ivoire"
              disabled
              aria-label="Pays de livraison"
            />
          </div>

          <div className={styles.inputGroup}>
            <label htmlFor="address" className={styles.label}>
              Adresse *
            </label>
            <input
              id="address"
              type="text"
              placeholder="Adresse complète"
              className={styles.input}
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              required
              aria-describedby="address-error"
            />
          </div>

          <div className={styles.inputGroup}>
            <label htmlFor="suite" className={styles.label}>
              Appartement, suite (facultatif)
            </label>
            <input
              id="suite"
              type="text"
              placeholder="Appartement, suite, etc."
              className={styles.input}
              value={suite}
              onChange={(e) => setSuite(e.target.value)}
            />
          </div>

          <div className={styles.inputGroup}>
            <label htmlFor="city" className={styles.label}>
              Ville *
            </label>
            <input
              id="city"
              type="text"
              placeholder="Ville"
              className={styles.input}
              value={city}
              onChange={(e) => setCity(e.target.value)}
              required
              aria-describedby="city-error"
            />
          </div>
        </div>

        {/* Payment Section */}
        <div className={styles.section}>
          <h2>Paiement</h2>
          <p className={styles.paymentDescription}>Paiement sécurisé via Wave Mobile Money</p>

          <div className={styles.paymentMethod}>
            <div className={styles.paymentHeader}>
              <div className={styles.paymentLabel}>
                <input
                  type="radio"
                  name="payment"
                  value="wave"
                  checked={paymentMethod === "wave"}
                  onChange={() => setPaymentMethod("wave")}
                  id="wave-payment"
                />
                <label htmlFor="wave-payment" className={styles.paymentLabelText}>
                  <div className={styles.waveIcon}></div>
                  Wave Mobile Money
                </label>
              </div>
            </div>

            <div className={styles.waveForm}>
              <div className={styles.wavePhoneContainer}>
                <div className={styles.inputGroup}>
                  <label htmlFor="waveCountryCode" className={styles.label}>
                    Code pays
                  </label>
                  <select
                    id="waveCountryCode"
                    className={styles.select}
                    value={waveCountryCode}
                    onChange={(e) => setWaveCountryCode(e.target.value)}
                  >
                    <option value="+225">🇨🇮 +225</option>
                    <option value="+221">🇸🇳 +221</option>
                    <option value="+223">🇲🇱 +223</option>
                    <option value="+226">🇧🇫 +226</option>
                  </select>
                </div>

                <div className={styles.inputGroup}>
                  <label htmlFor="wavePhone" className={styles.label}>
                    Numéro Wave *
                  </label>
                  <input
                    id="wavePhone"
                    type="tel"
                    placeholder="01 02 03 04 05"
                    className={styles.input}
                    value={wavePhone}
                    onChange={handleWavePhoneChange}
                    required
                    aria-describedby="wave-phone-help"
                    maxLength="14" // 10 digits + 4 spaces
                  />
                  <div id="wave-phone-help" className={styles.inputHelp}>
                    Format: 01 02 03 04 05
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* ❌ COMMENTED OUT: Card payment section */}
          {/*
          <div className={styles.paymentMethods}>
            <label className={styles.paymentLabel}>
              <input
                type="radio"
                name="payment"
                value="card"
                checked={paymentMethod === "card"}
                onChange={() => setPaymentMethod("card")}
              />
              💳 Carte bancaire
            </label>
          </div>
          
          {paymentMethod === "card" && (
            <div className={styles.cardForm}>
              <div className={styles.inputGroup}>
                <input
                  type="text"
                  placeholder="Numéro de carte"
                  className={styles.input}
                  value={cardNumber}
                  onChange={e => setCardNumber(e.target.value)}
                />
              </div>
              <div className={styles.inputRow}>
                <div className={styles.inputGroup}>
                  <input
                    type="text"
                    placeholder="MM / AA"
                    className={styles.input}
                    value={cardExpiry}
                    onChange={e => setCardExpiry(e.target.value)}
                  />
                </div>
                <div className={styles.inputGroup}>
                  <input
                    type="text"
                    placeholder="CVC"
                    className={styles.input}
                    value={cardCVC}
                    onChange={e => setCardCVC(e.target.value)}
                  />
                </div>
              </div>
              <div className={styles.inputGroup}>
                <input
                  type="text"
                  placeholder="Nom sur la carte"
                  className={styles.input}
                  value={nameOnCard}
                  onChange={e => setNameOnCard(e.target.value)}
                />
              </div>
              <div className={styles.checkbox}>
                <input
                  type="checkbox"
                  id="billingAddress"
                  checked={useBillingAddress}
                  onChange={e => setUseBillingAddress(e.target.checked)}
                />
                <label htmlFor="billingAddress">
                  Adresse de facturation = adresse de livraison
                </label>
              </div>
            </div>
          )}
          */}
        </div>
      </div>

      {/* Right Column - Order Summary */}
      <div className={styles.summary}>
        <h2>Récapitulatif de la commande</h2>

        {/* Cart Items */}
        <div className={styles.items}>
          {cart.map((item) => (
            <div key={item.id} className={styles.item}>
              <div className={styles.itemImageContainer}>
                <img src={item.image || "/placeholder.svg"} alt={item.name} className={styles.itemImage} />
                <span className={styles.itemQuantityBadge}>{item.quantity}</span>
              </div>
              <div className={styles.itemDetails}>
                <div className={styles.itemName}>{item.name}</div>
                {item.variant && <div className={styles.itemVariant}>{item.variant}</div>}
              </div>
              <div className={styles.itemPrice}>{formatCurrency(item.price * item.quantity)}</div>
            </div>
          ))}
        </div>

        <div className={styles.discountSection}>
          <div className={styles.discountInput}>
            <input
              type="text"
              placeholder="Code promo"
              className={styles.input}
              value={discountCode}
              onChange={(e) => setDiscountCode(e.target.value)}
              aria-label="Code de réduction"
            />
            <button className={styles.applyButton} type="button">
              Appliquer
            </button>
          </div>
        </div>

        <div className={styles.totals}>
          <div className={styles.totalRow}>
            <span>Sous-total</span>
            <span>{formatCurrency(subtotal)}</span>
          </div>
          <div className={styles.separator} />
          <div className={styles.totalRowFinal}>
            <span>Total</span>
            <span>{formatCurrency(total)}</span>
          </div>
        </div>

        <button className={styles.payButton} onClick={handlePayButton} type="button" aria-describedby="payment-info">
          Payer avec Wave
        </button>
        <div id="payment-info" className={styles.paymentInfo}>
          Paiement sécurisé via Wave Mobile Money
        </div>
      </div>
    </div>
  )
}
