"use client"

import { useState } from "react"
import { useCart } from "@/app/CartContext"
import styles from "./styles.module.css"

export default function CheckoutPage() {
  const { cart } = useCart()
  const [paymentMethod, setPaymentMethod] = useState("card")
  const [discountCode, setDiscountCode] = useState("")
  const [saveInfo, setSaveInfo] = useState(false)
  const [useBillingAddress, setUseBillingAddress] = useState(true)

  // Calcul du sous-total en XOF
  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const total = subtotal

  const formatCurrency = (amount) =>
    new Intl.NumberFormat("fr-FR", {
      style: "currency",
      currency: "XOF",
      minimumFractionDigits: 0,
    }).format(amount)

  return (
    <div className={styles.checkout}>
      {/* Colonne de gauche : Formulaire */}
      <div className={styles.formContainer}>
        {/* Section Contact */}
        <div className={styles.section}>
          <div className={styles.sectionHeader}>
            <h2>Contact</h2>
            
          </div>
          <div className={styles.inputGroup}>
            <input type="email" placeholder="Email" className={styles.input} />
          </div>
        </div>

        {/* Section Livraison */}
        <div className={styles.section}>
          <h2>Livraison</h2>
          <div className={styles.inputGroup}>
            <label className={styles.label}>Pays/Région</label>
            <select className={styles.select} defaultValue="ci">
              <option value="ci">Côte d'Ivoire</option>
              <option value="sn">Sénégal</option>
              <option value="ml">Mali</option>
            </select>
          </div>

          <div className={styles.inputRow}>
            <div className={styles.inputGroup}>
              <input type="text" placeholder="Prénom" className={styles.input} />
            </div>
            <div className={styles.inputGroup}>
              <input type="text" placeholder="Nom de famille" className={styles.input} />
            </div>
          </div>

          <div className={styles.inputGroup}>
            <input type="text" placeholder="Adresse" className={styles.input} />
          </div>

          <div className={styles.inputGroup}>
            <input
              type="text"
              placeholder="Appartement, suite, etc. (facultatif)"
              className={styles.input}
            />
          </div>

          <div className={styles.inputGroup}>
            <input type="text" placeholder="Ville" className={styles.input} />
          </div>

          <div className={styles.inputGroup}>
            <input type="tel" placeholder="Téléphone" className={styles.input} />
          </div>

          <div className={styles.checkbox}>
            <input
              type="checkbox"
              id="saveInfo"
              checked={saveInfo}
              onChange={(e) => setSaveInfo(e.target.checked)}
            />
            <label htmlFor="saveInfo">
              Enregistrer ces informations pour la prochaine fois
            </label>
          </div>
        </div>

        {/* Section Paiement */}
        <div className={styles.section}>
          <h2>Paiement</h2>
          <p className={styles.paymentDescription}>
            Toutes les transactions sont sécurisées et cryptées.
          </p>

          <div className={styles.paymentMethods}>
            {/* Carte bancaire */}
            <div className={styles.paymentMethod}>
              <div className={styles.paymentHeader}>
                <label className={styles.paymentLabel}>
                  <input
                    type="radio"
                    name="payment"
                    value="card"
                    checked={paymentMethod === "card"}
                    onChange={() => setPaymentMethod("card")}
                  />
                  <span className={styles.paymentIcon}>💳</span>
                  Carte bancaire
                </label>
                <div className={styles.cardLogos}>
                  <span className={styles.cardLogo}>VISA</span>
                  <span className={styles.cardLogo}>MC</span>
                  <span className={styles.cardLogo}>AMEX</span>
                  <span className={styles.cardLogo}>+2</span>
                </div>
              </div>

              {paymentMethod === "card" && (
                <div className={styles.cardForm}>
                  <div className={styles.inputGroup}>
                    <input
                      type="text"
                      placeholder="Numéro de carte"
                      className={styles.input}
                    />
                    <span className={styles.securityIcon}>🔒</span>
                  </div>

                  <div className={styles.inputRow}>
                    <div className={styles.inputGroup}>
                      <input
                        type="text"
                        placeholder="MM / AA"
                        className={styles.input}
                      />
                    </div>
                    <div className={styles.inputGroup}>
                      <input type="text" placeholder="CVC" className={styles.input} />
                      {/* <span className={styles.infoIcon}>ℹ️</span> */}
                    </div>
                  </div>

                  <div className={styles.inputGroup}>
                    <input
                      type="text"
                      placeholder="Nom sur la carte"
                      className={styles.input}
                    />
                  </div>

                  <div className={styles.checkbox}>
                    <input
                      type="checkbox"
                      id="billingAddress"
                      checked={useBillingAddress}
                      onChange={(e) => setUseBillingAddress(e.target.checked)}
                    />
                    <label htmlFor="billingAddress">
                      Utiliser l’adresse de livraison pour la facturation
                    </label>
                  </div>
                </div>
              )}
            </div>

            {/* Wave (Mobile Money) */}
            <div className={styles.paymentMethod}>
              <div className={styles.paymentHeader}>
                <label className={styles.paymentLabel}>
                  <input
                    type="radio"
                    name="payment"
                    value="wave"
                    checked={paymentMethod === "wave"}
                    onChange={() => setPaymentMethod("wave")}
                  />
                  <span className={styles.waveIcon}>
                    <img
                      src="/media/images/wave.png"
                      alt="Wave"
                      className={styles.waveIcon}
                    />
                  </span>
                  Wave (Mobile Money)
                </label>
              </div>

              {paymentMethod === "wave" && (
                <div className={styles.waveForm}>
                  <div className={styles.inputGroup}>
                    <input
                      type="tel"
                      placeholder="Téléphone Wave"
                      className={styles.input}
                    />
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* <button type="button" className={styles.morePaymentOptions}>
            Autres options de paiement
          </button> */}
        </div>
      </div>

      {/* Colonne de droite : Récapitulatif de la commande */}
      <div className={styles.summary}>
        <h2>Récapitulatif de la commande</h2>

        {/* Articles du panier */}
        <div className={styles.items}>
          {cart.map((item) => (
            <div key={item.id} className={styles.item}>
              <div className={styles.itemImageContainer}>
                <img
                  src={item.image || "/placeholder.svg"}
                  alt={item.name}
                  className={styles.itemImage}
                />
                <span className={styles.itemQuantityBadge}>{item.quantity}</span>
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

        {/* Code promo */}
        <div className={styles.discountSection}>
          <div className={styles.discountInput}>
            <input
              type="text"
              placeholder="Code promo"
              value={discountCode}
              onChange={(e) => setDiscountCode(e.target.value)}
              className={styles.input}
            />
            <button type="button" className={styles.applyButton}>
              Appliquer
            </button>
          </div>
        </div>

        {/* Totaux */}
        <div className={styles.totals}>
          <div className={styles.totalRow}>
            <span>Sous-total</span>
            <span>{formatCurrency(subtotal)}</span>
          </div>
          <div className={styles.separator}></div>
          <div className={styles.totalRowFinal}>
            <span>Total</span>
            <div className={styles.totalValue}>
              {formatCurrency(total)}
            </div>
          </div>
        </div>

        {/* Avis taxes */}
        <div className={styles.taxNotice}>
          {/* <span className={styles.infoIcon}>ℹ️</span> */}
          <span>
            Les taxes locales, droits de douane ou frais de dédouanement peuvent
            s’appliquer
          </span>
        </div>

        {/* Bouton de paiement */}
        <button className={styles.payButton}>Payer maintenant</button>
      </div>
    </div>
  )
}
