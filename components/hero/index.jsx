import Link from 'next/link';
import ShopNowButton from '../buttons/shopNowButtton'
import styles from './styles.module.css';

export default async function Hero() {

    return (
        <div className= {styles.hero}>
            <img src='media/hero/hero2.jpg' alt='Hero Image' className={styles.heroImage} />
            <div className={styles.heroContent}>
                <h1 className={styles.heroTitle}>Roulez <span className={styles.emph}>propre</span>, vivez <span className={styles.emph}>l'avenir</span></h1>
                <p className={styles.heroSubtitle}>Mobilité électrique accessible pour la Côte d’Ivoire</p>
            </div>
            <div className={styles.heroButtonContainer}>
                <Link href="/products">
                <ShopNowButton/>
                </Link>
            </div>
        </div>
    )
}