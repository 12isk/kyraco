"use client"

import { useState } from "react"
import { useCart } from "@/app/CartContext"
import { useRouter } from "next/navigation"
import styles from "./styles.module.css"

export default function CheckoutPage() {
  const { cart } = useCart()
  const router = useRouter()

  // Personal info
  const [email, setEmail] = useState("")
  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")
  const [phone, setPhone] = useState("")
  const [saveInfo, setSaveInfo] = useState(false)

  // Address
  const [address, setAddress] = useState("")
  const [suite, setSuite] = useState("")
  const [city, setCity] = useState("")

  // Wave payment
  const [waveCountryCode, setWaveCountryCode] = useState("+225")
  const [wavePhone, setWavePhone] = useState("")
  const [discountCode, setDiscountCode] = useState("")

  // Totals
  const subtotal = cart.reduce((sum, i) => sum + i.price * i.quantity, 0)
  const shipping = 0 // FREE shipping
  const total = subtotal + shipping

  const formatCurrency = (amt) =>
    new Intl.NumberFormat("fr-FR", {
      style: "currency",
      currency: "XOF",
      minimumFractionDigits: 0,
    }).format(amt)

  // Format phone as "01 02 03 04 05"
  const formatPhoneNumber = (v) =>
    v
      .replace(/\D/g, "")
      .replace(/(\d{2})(?=\d)/g, "$1 ")
      .trim()

  const handleWavePhoneChange = (e) => {
    const f = formatPhoneNumber(e.target.value)
    if (f.replace(/\s/g, "").length <= 10) setWavePhone(f)
  }

  async function handlePay() {

    const customer = {
      firstName: firstName,
      lastName: lastName,
      phone: phone,
      address: address,
      city: city
    };

    try {
      const orderId = crypto.randomUUID();
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customer: customer,
          orderId: orderId,
          amount: total,
          phoneNumber: waveCountryCode + wavePhone.replace(/\s/g, ""),
        }),
      })
      const session = await res.json()
      localStorage.setItem("session", JSON.parse("session"));
      if (!res.ok) throw new Error(session.error)
      router.push(session.wave_launch_url)
    } catch (err) {
      console.error(err)
      alert("Erreur de paiement : " + err.message)
    }
  }

  return (
    <div className={styles.checkout}>
      <div className={styles.formContainer}>
        {/* Contact */}
        <div className={styles.section}>
          <div className={styles.sectionHeader}>
            <h2>Contact</h2>
          </div>

          <div className={styles.inputGroup}>
            <input
              id="email"
              type="email"
              placeholder=" "
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className={styles.input}
            />
            <label htmlFor="email" className={styles.floatingLabel}>
              Email
            </label>
          </div>
        </div>

        {/* Delivery */}
        <div className={styles.section}>
          <h2>Delivery</h2>

          <div className={styles.inputGroup}>
            <select id="country" className={styles.select} value="ci" onChange={() => {}}>
              <option value="ci">Côte d'Ivoire</option>
            </select>
            <label htmlFor="country" className={styles.selectLabel}>
              Country/Region
            </label>
          </div>

          <div className={styles.inputRow}>
            <div className={styles.inputGroup}>
              <input
                id="firstName"
                type="text"
                placeholder=" "
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                required
                className={styles.input}
              />
              <label htmlFor="firstName" className={styles.floatingLabel}>
                First name
              </label>
            </div>
            <div className={styles.inputGroup}>
              <input
                id="lastName"
                type="text"
                placeholder=" "
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                required
                className={styles.input}
              />
              <label htmlFor="lastName" className={styles.floatingLabel}>
                Last name
              </label>
            </div>
          </div>

          <div className={styles.inputGroup}>
            <input
              id="address"
              type="text"
              placeholder=" "
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              required
              className={styles.input}
            />
            <label htmlFor="address" className={styles.floatingLabel}>
              Address
            </label>
          </div>

          <div className={styles.inputGroup}>
            <input
              id="suite"
              type="text"
              placeholder=" "
              value={suite}
              onChange={(e) => setSuite(e.target.value)}
              className={styles.input}
            />
            <label htmlFor="suite" className={styles.floatingLabel}>
              Apartment, suite, etc. (optional)
            </label>
          </div>

          <div className={styles.inputGroup}>
            <input
              id="city"
              type="text"
              placeholder=" "
              value={city}
              onChange={(e) => setCity(e.target.value)}
              required
              className={styles.input}
            />
            <label htmlFor="city" className={styles.floatingLabel}>
              City
            </label>
          </div>

          <div className={styles.inputGroup}>
            <input
              id="phone"
              type="tel"
              placeholder=" "
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              required
              className={styles.input}
            />
            <label htmlFor="phone" className={styles.floatingLabel}>
              Phone
            </label>
          </div>

          <div className={styles.checkbox}>
            <input id="saveInfo" type="checkbox" checked={saveInfo} onChange={(e) => setSaveInfo(e.target.checked)} />
            <label htmlFor="saveInfo">Save this information for next time</label>
          </div>
        </div>

        {/* Payment */}
        <div className={styles.section}>
          <h2>Payment</h2>
          <p className={styles.paymentDescription}>All transactions are secure and encrypted.</p>

          <div className={styles.paymentMethod}>
            <div className={styles.paymentHeader}>
              <label className={styles.paymentLabel}>
                <input type="radio" name="payment" checked readOnly />
                <span className={styles.waveIcon}></span>
                Wave Mobile Money
              </label>
            </div>

            <div className={styles.waveForm}>
              <div className={styles.wavePhoneContainer}>
                <div className={styles.inputGroup}>
                  <select
                    id="waveCountryCode"
                    className={styles.select}
                    value={waveCountryCode}
                    onChange={(e) => setWaveCountryCode(e.target.value)}
                  >
                    <option value="+225">🇨🇮 +225</option>
                  </select>
                  <label htmlFor="waveCountryCode" className={styles.selectLabel}>
                    Code pays
                  </label>
                </div>

                <div className={styles.inputGroup}>
                  <input
                    id="wavePhone"
                    type="tel"
                    placeholder=" "
                    value={wavePhone}
                    onChange={handleWavePhoneChange}
                    required
                    className={styles.input}
                    maxLength={14}
                  />
                  <label htmlFor="wavePhone" className={styles.floatingLabel}>
                    Numéro Wave *
                  </label>
                  <div className={styles.inputHelp}>Format : 01 02 03 04 05</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Order Summary */}
      <div className={styles.summary}>
        <h2>Order summary</h2>

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
          <div className={styles.inputGroup}>
            <input
              type="text"
              placeholder=" "
              value={discountCode}
              onChange={(e) => setDiscountCode(e.target.value)}
              className={styles.input}
            />
            <label className={styles.floatingLabel}>Discount code</label>
            <button className={styles.applyButton}>Apply</button>
          </div>
        </div>

        <div className={styles.totals}>
          <div className={styles.totalRow}>
            <span>Subtotal</span>
            <span>{formatCurrency(subtotal)}</span>
          </div>
          <div className={styles.totalRow}>
            <span>Shipping</span>
            <span>{shipping === 0 ? "FREE" : formatCurrency(shipping)}</span>
          </div>
          <div className={styles.separator} />
          <div className={styles.totalRowFinal}>
            <span>Total</span>
            <div>
              <span style={{ fontSize: "0.75rem", color: "#6b7280", marginRight: "0.25rem" }}>XOF</span>
              <span>{formatCurrency(total)}</span>
            </div>
          </div>
        </div>

        <div className={styles.taxNotice}>
          <span>ℹ️</span>
          <span>Local taxes, duties or customs clearance fees may apply</span>
        </div>

        <button className={styles.payButton} onClick={handlePay}>
          Complete order
        </button>
      </div>
    </div>
  )
}
