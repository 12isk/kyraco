"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, CheckCircle, AlertCircle, AlertTriangle, Info } from "lucide-react";
import styles from "./styles.module.css";

export const AlertModal = ({
  isOpen,
  onClose,
  title,
  message,
  type = "info",
  autoClose = true,
  customDuration,
}) => {
  const [isVisible, setIsVisible] = useState(isOpen);

  // Calculate auto-close duration based on text length
  const calculateDuration = () => {
    if (customDuration) return customDuration;

    const baseTime = 2000; // 2 seconds minimum
    const textLength = (title || "").length + message.length;
    const additionalTime = Math.max(0, (textLength - 50) * 50); // 50ms per char after 50

    return Math.min(baseTime + additionalTime, 8000); // max 8s
  };

  useEffect(() => {
    setIsVisible(isOpen);

    if (isOpen && autoClose) {
      const duration = calculateDuration();
      const timer = setTimeout(() => {
        handleClose();
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [isOpen, autoClose, title, message]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(() => {
      onClose && onClose();
    }, 300); // Wait for exit animation
  };

  const getIcon = () => {
    switch (type) {
      case "success":
        return (
          <CheckCircle
            className={`${styles.icon} ${styles.successIcon}`}
            size={24}
          />
        );
      case "error":
        return (
          <AlertCircle className={`${styles.icon} ${styles.errorIcon}`} size={24} />
        );
      case "warning":
        return (
          <AlertTriangle
            className={`${styles.icon} ${styles.warningIcon}`}
            size={24}
          />
        );
      case "info":
      default:
        return <Info className={`${styles.icon} ${styles.infoIcon}`} size={24} />;
    }
  };

  const modalVariants = {
    hidden: { opacity: 0, scale: 0.8, y: -50 },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: { type: "spring", stiffness: 300, damping: 30, duration: 0.4 },
    },
    exit: { opacity: 0, scale: 0.8, y: -50, transition: { duration: 0.3, ease: "easeInOut" } },
  };

  const overlayVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.3 } },
    exit: { opacity: 0, transition: { duration: 0.3 } },
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          className={styles.overlay}
          variants={overlayVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          onClick={handleClose}
        >
          <motion.div
            className={`${styles.modal} ${styles[type]}`}
            variants={modalVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <motion.button
              className={styles.closeButton}
              onClick={handleClose}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              aria-label="Fermer"
            >
              <X size={16} className={styles.closeIcon} />
            </motion.button>

            {/* Content */}
            <div className={styles.content}>
              <div className={styles.header}>
                {getIcon()}
                {title && <h3 className={styles.title}>{title}</h3>}
              </div>

              <p className={styles.message}>{message}</p>
            </div>

            {/* Progress Bar (for auto-close) */}
            {autoClose && (
              <motion.div
                className={styles.progressBar}
                initial={{ width: "100%" }}
                animate={{ width: "0%" }}
                transition={{ duration: calculateDuration() / 1000, ease: "linear" }}
              />
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

// AlertModal.propTypes = {
//   isOpen: PropTypes.bool.isRequired,
//   onClose: PropTypes.func.isRequired,
//   title: PropTypes.string,
//   message: PropTypes.string.isRequired,
//   type: PropTypes.oneOf(["success", "error", "warning", "info"]),
//   autoClose: PropTypes.bool,
//   customDuration: PropTypes.number,
// };

// Hook for easy usage
export const useAlertModal = () => {
  const [alert, setAlert] = useState({
    isOpen: false,
    message: "",
    type: "info",
    title: undefined,
    autoClose: true,
    customDuration: undefined,
  });

  const showAlert = (message, options = {}) => {
    setAlert({
      isOpen: true,
      message,
      title: options.title,
      type: options.type || "info",
      autoClose: options.autoClose ?? true,
      customDuration: options.customDuration,
    });
  };

  const closeAlert = () => {
    setAlert((prev) => ({ ...prev, isOpen: false }));
  };

  const showSuccess = (message, title) => showAlert(message, { type: "success", title });
  const showError = (message, title) => showAlert(message, { type: "error", title });
  const showWarning = (message, title) => showAlert(message, { type: "warning", title });
  const showInfo = (message, title) => showAlert(message, { type: "info", title });

  return {
    alert,
    showAlert,
    closeAlert,
    showSuccess,
    showError,
    showWarning,
    showInfo,
  };
};
