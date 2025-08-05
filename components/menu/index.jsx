"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import styles from "./styles.module.css";
import { useCart } from "@/app/CartContext";
import { useRouter } from "next/navigation";

// Hook: detect mobile viewport ≤ breakpoint px
function useIsMobile(breakpoint = 900) {
  const [isMobile, setIsMobile] = useState(false);
  // Check on initial render
  useEffect(() => {
    if (typeof window === "undefined") return;
    const mq = window.matchMedia(`(max-width: ${breakpoint}px)`);
    const onChange = (e) => setIsMobile(e.matches);
    setIsMobile(mq.matches);
    if (mq.addEventListener) mq.addEventListener("change", onChange);
    else mq.addListener(onChange);
    return () => {
      if (mq.removeEventListener) mq.removeEventListener("change", onChange);
      else mq.removeListener(onChange);
    };
  }, [breakpoint]);
  return isMobile;
}


// SVG Hamburger Icon
function HamburgerIcon(props) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.5}
      stroke="currentColor"
      aria-hidden="true"
      {...props}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M3.75 9h16.5m-16.5 6.75h16.5"
      />
    </svg>
  );
}

const formatter = new Intl.NumberFormat("fr-FR", {
  style: "currency",
  currency: "XOF",
  minimumFractionDigits: 0,
});

export default function Menu() {
  const pathname = usePathname() || "";
  const isProductPage = /^\/products\/[^\/]+$/.test(pathname);
  const isMobile = useIsMobile(900);

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);

  // Cart state
  const { cart, addItem, removeItem, updateQty, clearCart } = useCart();

    // mounted only toggles true on client
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true) }, []);

  const router = useRouter();

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0).toFixed(2);
  const formattedSubtotal = formatter.format(subtotal);

  // decide variants *only* after mount
  const showMobileMenu = mounted && isMobile;
  const showDesktopMenu = !mounted || !isMobile;

  // Breadcrumb slug
  const slug = isProductPage ? pathname.split("/").pop() : null;
  const prettySlug = slug ? decodeURIComponent(slug).replace(/-/g, " ") : "";


  // Handle checkout button click
  const handleCheckout = () => {
    router.push('/checkout');
    setCartOpen(false); // Close cart overlay
  }

  return (
    <>
      {/* ===== Main Menu Bar ===== */}
      <div className={`${styles.menu} ${isProductPage ? styles.productMenu : ""}`}>
        {/* Desktop: left + middle */}
        {showDesktopMenu && (
          <>
            <div className={styles.leftContainer}>
              <Link href="/" aria-label="Home">
                <img src="/icons/kyraco.svg" alt="Logo" className={styles.logo} />
              </Link>
              {isProductPage && (
                <div className={styles.breadcrumbs}>
                  <Link href="/products" className={styles.crumb}>Produits</Link>
                  <span className={styles.separator}>/</span>
                  <span className={styles.current}>{prettySlug}</span>
                </div>
              )}
            </div>
            <div className={styles.middleContainer}>
              {!isProductPage ? (
                <div className={styles.menuItemsWrapper}>
                  {["Accueil","Produits","À propos","Contact"].map((name,i)=>(
                    <Link key={i} href={["/","/products","/about","/contact"][i]} className={styles.menuItem}>
                      {name}
                    </Link>
                  ))}
                </div>
              ) : (
                <div className={styles.modularItems}>
                  <button className={styles.moduleButton}>
                    <Link href="/products" style={{ textDecoration:"none", color:"inherit" }}>
                      All
                    </Link>
                  </button>
                  <div className={styles.searchWrapper}>
                    <input className={styles.searchInput} placeholder="Search" aria-label="Search products"/>
                    {/* <button className={styles.searchButton} aria-label="Search">➔</button> */}
                  </div>
                  <button className={styles.moduleButton}>Filter</button>
                </div>
              )}
            </div>
          </>
        )} 
{/* todo: make it so opening the menu closes the cart  */}
        {/* ===== Right Controls ===== */}
        <div className={styles.rightContainer}>
          {/* Desktop non-product: cart icon */}
          {!isProductPage && showDesktopMenu && (
            <button className={styles.cartLink} onClick={()=>setCartOpen(true)}>
              <div className={styles.cartIconWrapper}>
                <img src="/icons/cart.svg" alt="Cart" className={styles.cartIcon}/>
                {cartCount>0&&(
                  <div className={styles.smallBadge}>
                    <span className={styles.smallBadgeText}>{cartCount}</span>
                  </div>
                )}
              </div>
            </button>
          )}

          {/* Desktop product page: count + super-dot */}
          {isProductPage && showDesktopMenu && (
            <button className={styles.productCountDesktop} onClick={()=>setCartOpen(true)}>
              <span className={styles.countText}>{cartCount}</span>
              {cartCount>0&&<span className={styles.greenDot} aria-hidden="true"/>}
            </button>
          )}

          {/* Mobile: pill-style count + hamburger */}
          {showMobileMenu && (
            <div className={styles.mobileOnlyWrapper}>
              <button className={styles.countButton} onClick={()=>setCartOpen(true)}>
                <span className={styles.countText}>{cartCount}</span>
                {cartCount>0&&<span className={styles.greenDot} aria-hidden="true"/>}
              </button>
              <button
                aria-label="Open menu"
                className={styles.hamburgerButton}
                onClick={()=>setMobileMenuOpen(true)}
              >
                <HamburgerIcon className="size-6" />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* ===== Mobile Menu Overlay ===== */}
      {mobileMenuOpen && showMobileMenu && (
        <div className={styles.mobileOverlay} role="dialog" aria-modal="true">
          <div className={styles.overlayHeader}>
            <div className={styles.searchWrapperMobile}>
              <input className={styles.searchInputMobile} placeholder="Search" aria-label="Search"/>
              {/* <button className={styles.searchButtonMobile} aria-label="Search">➔</button> */}
            </div>
            <button className={styles.closeToggle} onClick={()=>setMobileMenuOpen(false)} aria-label="Close menu">×</button>
          </div>
          <nav className={styles.mobileNavList}>
            {["Accueil","Produits","À propos","Contact"].map((name,i)=>(
              <Link 
                key={i}
                href={["/","/products","/about","/contact"][i]}
                className={styles.mobileNavItem}
                onClick={()=>setMobileMenuOpen(false)}
              >
                {name}
              </Link>
            ))}
          </nav>
        </div>
      )}

      {/* ===== Cart Overlay ===== */}
      {cartOpen && (
        <div className={styles.cartOverlay} role="dialog" aria-modal="true">
          <div className={styles.cartHeader}>
            <h2>{cartCount} Product{cartCount>1?"s":""} in your cart</h2>
            <button className={styles.cartClose} onClick={()=>setCartOpen(false)} aria-label="Close cart">×</button>
          </div>
          <div className={styles.cartItemList}>
            {cart.length === 0  ? (
              <p> Votre Panier est vide.</p>
            ) : (
              cart.map(item=>(
              <div key={item.id} className={styles.cartItem}>
                <img src={item.image} alt={item.name} className={styles.cartItemImage}/>
                <div className={styles.cartItemInfo}>
                  <div className={styles.cartItemName}>{item.name}</div>
                  <div className={styles.cartItemVariant}>{item.variant}</div>
                  <div className={styles.cartItemPrice}>{formatter.format(item.price)}</div>

                  <select className={styles.cartItemQty} 
                    value={item.quantity}
                    onChange={e => updateQty(item.id, Number(e.target.value))}
                  >
                    {[1,2,3,4,5].map(n=>(
                      <option key={n} value={n}>{n}</option>
                    ))}
                  </select>
                </div>
                <button className={styles.cartItemRemove}
                  aria-label={`Remove ${item.name}`}
                  onClick={() => removeItem(item.id)}
                >
                  ×
                </button>
              </div>
            ))
            )
          }
          
          {/* Subtotal, etc */}
          </div>
          <div className={styles.cartFooter}>
            <div className={styles.cartSubtotalLabel}>Subtotal</div>
            <div className={styles.cartSubtotalValue}>{formattedSubtotal}</div>
          </div>
          <div className={styles.cartNote}>
            Taxes, discounts and shipping calculated at checkout.
          </div>
          <button className={styles.checkoutButton} onClick={handleCheckout}>Check out</button>
        </div>
      )}
    </>
  );
}
