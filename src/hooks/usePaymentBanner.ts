/**
 * Payment Banner Hook
 * Manages payment banner state and subscription package selection
 */

import { useState, useCallback } from "react";
import type { SubscriptionPlan } from "../types/Payment";

interface PaymentBannerState {
  isOpen: boolean;
  selectedPlan: SubscriptionPlan | null;
  archetypeId: string;
}

export const usePaymentBanner = () => {
  const [bannerState, setBannerState] = useState<PaymentBannerState>({
    isOpen: false,
    selectedPlan: null,
    archetypeId: "",
  });

  const openPaymentBanner = useCallback(
    (plan: SubscriptionPlan, archetype: string) => {
      setBannerState({
        isOpen: true,
        selectedPlan: plan,
        archetypeId: archetype,
      });
    },
    [],
  );

  const closePaymentBanner = useCallback(() => {
    setBannerState({
      isOpen: false,
      selectedPlan: null,
      archetypeId: "",
    });
  }, []);

  const handlePaymentSuccess = useCallback(
    (result: any) => {
      console.log("Payment successful:", result);

      // Track payment success
      if (typeof window !== "undefined" && window.gtag) {
        window.gtag("event", "purchase", {
          transaction_id: result.transaction_id,
          value: result.amount,
          currency: result.currency,
          items: [
            {
              item_id: bannerState.selectedPlan?.id,
              item_name: bannerState.selectedPlan?.name,
              category: "subscription",
              quantity: 1,
              price: bannerState.selectedPlan?.price,
            },
          ],
        });
      }

      // Store success state for authentication flow
      localStorage.setItem("paymentSuccess", "true");
      localStorage.setItem(
        "lastSuccessfulPayment",
        JSON.stringify({
          plan: bannerState.selectedPlan,
          archetype: bannerState.archetypeId,
          result,
          timestamp: Date.now(),
        }),
      );
    },
    [bannerState.selectedPlan, bannerState.archetypeId],
  );

  const handlePaymentError = useCallback(
    (error: any) => {
      console.error("Payment failed:", error);

      // Track payment failure
      if (typeof window !== "undefined" && window.gtag) {
        window.gtag("event", "purchase_failed", {
          error_message: error.message || "Unknown error",
          plan_id: bannerState.selectedPlan?.id,
          archetype: bannerState.archetypeId,
        });
      }

      // Could show additional error handling UI here
    },
    [bannerState.selectedPlan, bannerState.archetypeId],
  );

  return {
    bannerState,
    openPaymentBanner,
    closePaymentBanner,
    handlePaymentSuccess,
    handlePaymentError,
  };
};

export default usePaymentBanner;
