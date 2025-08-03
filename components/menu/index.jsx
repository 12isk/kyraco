import React from 'react'
import styles from './styles.module.css';

export default function Menu() {

    const elements = [
        {name: 'Accueil', link: '/'},
        {name: 'Produits', link: '/products'},
        {name: 'À propos', link: '/about'},
        {name: 'Contact', link: '/contact'},
    ]

  return (
    <div className={styles.menu}>
        <div className={styles.leftContainer}>
            <img src='icons/kyraco.svg' alt='Kyraco Logo' className={styles.logo} />
        </div>
        <div className={styles.middleContainer}>
            {elements.map((element, index) => (
                <a key={index} href={element.link} className={styles.menuItem}>
                    {element.name}
                </a>
            ))}
        </div>
        <div className={styles.rightContainer}>
            <a href="/cart" className={styles.cartLink}>
                <img src='icons/cart.svg' alt='Cart Icon' className={styles.cartIcon} />
                <span className={styles.cartCount}>0</span>
            </a>
        </div>
    </div>
  )
}
