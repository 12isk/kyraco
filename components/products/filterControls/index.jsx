import styles from './styles.module.css';
import React from 'react';

const FilterControls = ({
  filters,
  onFiltersChange,
  categories,
  productCount
}) => {
  const handleCategoryChange = (category) => {
    onFiltersChange(prev => ({
      ...prev,
      category
    }));
  };

  const handleSortChange = (event) => {
    onFiltersChange(prev => ({
      ...prev,
      sort: event.target.value
    }));
  };

  return (
    <div className={styles.filterControls}>
      <div className={styles.topRow}>
        <h1 className={styles.title}>All Products</h1>
        <div className={styles.rightControls}>
          <span className={styles.productCount}>{productCount}</span>
          <select 
            className={styles.sortSelect}
            value={filters.sort}
            onChange={handleSortChange}
          >
            <option value="name">Sort</option>
            <option value="name">Name A-Z</option>
            <option value="price-low">Price Low-High</option>
            <option value="price-high">Price High-Low</option>
            <option value="newest">Newest</option>
          </select>
        </div>
      </div>
      
      <div className={styles.categoryFilter}>
        {categories.map(category => (
          <button
            key={category}
            className={`${styles.categoryBtn} ${filters.category === category ? styles.active : ''}`}
            onClick={() => handleCategoryChange(category)}
          >
            {category === 'all' ? 'All' : category}
          </button>
        ))}
      </div>
    </div>
  );
};

export default FilterControls;