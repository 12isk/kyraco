"use client";

import { useState } from "react";
import { useCart } from "@/app/CartContext";
import styles from "./styles.module.css";
import { createCheckoutSession } from "@/lib/waveApi"; // Adjust the import path as needed
import { useRouter } from "next/navigation";

export default function CheckoutPage() {
  const { cart } = useCart();

  // ▶️ State for grouped fields
  const [email, setEmail]               = useState("");
  const [firstName, setFirstName]       = useState("");
  const [lastName, setLastName]         = useState("");
  const [phone, setPhone]               = useState("");
  const [address, setAddress]           = useState("");
  const [suite, setSuite]               = useState("");
  const [city, setCity]                 = useState("");
  const [saveInfo, setSaveInfo]         = useState(false);

  const [paymentMethod, setPaymentMethod]       = useState("card");
  const [cardNumber, setCardNumber]             = useState("");
  const [cardExpiry, setCardExpiry]             = useState("");
  const [cardCVC, setCardCVC]                   = useState("");
  const [nameOnCard, setNameOnCard]             = useState("");
  const [useBillingAddress, setUseBillingAddress] = useState(true);
  const [wavePhone, setWavePhone]               = useState("");
  const [discountCode, setDiscountCode]         = useState("");

  // totals
  const subtotal = cart.reduce((sum, i) => sum + i.price * i.quantity, 0);
  const total    = subtotal;
  const formatCurrency = (amt) =>
    new Intl.NumberFormat("fr-FR", {
      style:    "currency",
      currency: "XOF",
      minimumFractionDigits: 0,
    }).format(amt);

  const router = useRouter();

  async function handlePayButton() {
    const data = {
      email, firstName, lastName, phone,
      address, suite, city,
      paymentMethod,
      card: { cardNumber, cardExpiry, cardCVC, nameOnCard },
      wavePhone, discountCode, saveInfo, useBillingAddress,
      subtotal, total,
    };
    console.log("Checkout payload:", data);

    if (paymentMethod === "wave") {
      try{
        // 1) create a new session on your server
        const res = await fetch("/api/checkout", {
          method:  "POST",
          headers: { "Content-Type": "application/json" },
          body:    JSON.stringify({
            amount:      cart.reduce((sum,i)=>sum + i.price*i.quantity, 0),
            phoneNumber: wavePhone,              // whatever you collect
          }),
        });

        const session = await res.json();
        if (!res.ok) throw new Error(session.error||"Erreur de création de session");

        // 2) redirect the browser to Wave’s payment page
        router.push(session.wave_launch_url);
      } catch (err) {
        console.error(err);
        
        //alert("Impossible de lancer le paiement : " + err.message);
      }
        
      

    }
  };

  return (
    <div className={styles.checkout}>
      {/* Left: formulaire */}
      <div className={styles.formContainer}>

        {/* Informations personnelles */}
        <div className={styles.section}>
          <div className={styles.sectionHeader}>
            <h2>Informations personnelles</h2>
          </div>
          <div className={styles.inputGroup}>
            <input
              type="email"
              placeholder="Email"
              className={styles.input}
              value={email}
              onChange={e => setEmail(e.target.value)}
            />
          </div>
          <div className={styles.inputRow}>
            <div className={styles.inputGroup}>
              <input
                type="text"
                placeholder="Prénom"
                className={styles.input}
                value={firstName}
                onChange={e => setFirstName(e.target.value)}
              />
            </div>
            <div className={styles.inputGroup}>
              <input
                type="text"
                placeholder="Nom de famille"
                className={styles.input}
                value={lastName}
                onChange={e => setLastName(e.target.value)}
              />
            </div>
          </div>
          <div className={styles.inputGroup}>
            <input
              type="tel"
              placeholder="Téléphone"
              className={styles.input}
              value={phone}
              onChange={e => setPhone(e.target.value)}
            />
          </div>
          <div className={styles.checkbox}>
            <input
              type="checkbox"
              id="saveInfo"
              checked={saveInfo}
              onChange={e => setSaveInfo(e.target.checked)}
            />
            <label htmlFor="saveInfo">
              Enregistrer ces infos pour la prochaine fois
            </label>
          </div>
        </div>

        {/* Adresse de livraison */}
        <div className={styles.section}>
          <h2>Adresse de livraison</h2>
          <div className={styles.inputGroup}>
            {/* Pays fixe */}
            <input
              type="text"
              className={styles.input}
              value="Côte d’Ivoire"
              disabled
            />
          </div>
          <div className={styles.inputGroup}>
            <input
              type="text"
              placeholder="Adresse"
              className={styles.input}
              value={address}
              onChange={e => setAddress(e.target.value)}
            />
          </div>
          <div className={styles.inputGroup}>
            <input
              type="text"
              placeholder="Appartement, suite (facultatif)"
              className={styles.input}
              value={suite}
              onChange={e => setSuite(e.target.value)}
            />
          </div>
          <div className={styles.inputGroup}>
            <input
              type="text"
              placeholder="Ville"
              className={styles.input}
              value={city}
              onChange={e => setCity(e.target.value)}
            />
          </div>
        </div>

        {/* Paiement (inchangé) */}
        <div className={styles.section}>
          <h2>Paiement</h2>
          <p className={styles.paymentDescription}>
            Transactions sécurisées et cryptées.
          </p>
          <div className={styles.paymentMethods}>
            <label className={styles.paymentLabel}>
              <input
                type="radio"
                name="payment"
                value="card"
                checked={paymentMethod==="card"}
                onChange={()=>setPaymentMethod("card")}
              />
              💳 Carte bancaire
            </label>
            <label className={styles.paymentLabel}>
              <input
                type="radio"
                name="payment"
                value="wave"
                checked={paymentMethod==="wave"}
                onChange={()=>setPaymentMethod("wave")}
              />
              Wave (Mobile Money)
            </label>
          </div>
          {paymentMethod==="card" && (
            <div className={styles.cardForm}>
              <div className={styles.inputGroup}>
                <input
                  type="text"
                  placeholder="Numéro de carte"
                  className={styles.input}
                  value={cardNumber}
                  onChange={e=>setCardNumber(e.target.value)}
                />
              </div>
              <div className={styles.inputRow}>
                <div className={styles.inputGroup}>
                  <input
                    type="text"
                    placeholder="MM / AA"
                    className={styles.input}
                    value={cardExpiry}
                    onChange={e=>setCardExpiry(e.target.value)}
                  />
                </div>
                <div className={styles.inputGroup}>
                  <input
                    type="text"
                    placeholder="CVC"
                    className={styles.input}
                    value={cardCVC}
                    onChange={e=>setCardCVC(e.target.value)}
                  />
                </div>
              </div>
              <div className={styles.inputGroup}>
                <input
                  type="text"
                  placeholder="Nom sur la carte"
                  className={styles.input}
                  value={nameOnCard}
                  onChange={e=>setNameOnCard(e.target.value)}
                />
              </div>
              <div className={styles.checkbox}>
                <input
                  type="checkbox"
                  id="billingAddress"
                  checked={useBillingAddress}
                  onChange={e=>setUseBillingAddress(e.target.checked)}
                />
                <label htmlFor="billingAddress">
                  Adresse de facturation = adresse de livraison
                </label>
              </div>
            </div>
          )}
          {paymentMethod==="wave" && (
            <div className={styles.waveForm}>
              <div className={styles.inputGroup}>
                <input
                  type="tel"
                  placeholder="Téléphone Wave"
                  className={styles.input}
                  value={wavePhone}
                  onChange={e=>setWavePhone(e.target.value)}
                />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Right résumé */}
      <div className={styles.summary}>
        <h2>Récapitulatif de la commande</h2>
        {/* … your items list … */}
        <div className={styles.discountSection}>
          <input
            type="text"
            placeholder="Code promo"
            className={styles.input}
            value={discountCode}
            onChange={e=>setDiscountCode(e.target.value)}
          />
          <button className={styles.applyButton}>Appliquer</button>
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
        <button className={styles.payButton} onClick={handlePayButton}>
          Payer maintenant
        </button>
      </div>
    </div>
  );
}
