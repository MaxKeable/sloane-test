import fetcher from "../utils/fetcher";

interface SubscriptionResponse {
  subscriptionId: string;
  requiresPayment: boolean;
  requiresSetup?: boolean;
  clientSecret?: string; // present when payment is due now
  setupClientSecret?: string; // present when collecting card for future invoices
}

interface SubscriptionRequest {
  promoCode?: string;
  country?: string;
}

// const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY!);

export namespace StripeService {
  export const createCheckout = async () => {
    const response = await fetcher("/api/stripe/create-checkout", {
      method: "POST",
    });
    console.log(response.data);
    return response.data;
  };

  export const checkSubscription = async () => {
    const response = await fetcher("/api/stripe/check-subscription", {
      method: "GET",
    });
    return response.data;
  };

  export const createSubscription = async (
    data: SubscriptionRequest
  ): Promise<SubscriptionResponse> => {
    console.log("Creating subscription with data:", data);
    const response = await fetcher("/api/stripe/create-subscription", {
      method: "POST",
      data: {
        promoCode: data.promoCode,
        country: data.country || "US",
      },
    });

    console.log("Subscription response:", response);

    if (!response.data) {
      throw new Error("Failed to create subscription");
    }

    return response.data;
  };

  export const finalizeSubscription = async (
    subscriptionId: string,
    setupIntentId?: string
  ): Promise<void> => {
    await fetcher(`/api/stripe/finalize-subscription/${subscriptionId}`, {
      method: "POST",
      data: setupIntentId ? { setupIntentId } : undefined,
    });
  };

  export const validatePromoCode = async (
    promoCode: string
  ): Promise<{ discount: number }> => {
    try {
      const response = await fetcher("/api/stripe/validate-promo", {
        method: "POST",
        data: { promoCode },
      });

      // Check if response is ok and is JSON
      // if (!response.ok) {
      //   const contentType = response.headers.get('content-type');
      //   if (contentType && contentType.includes('application/json')) {
      //     const errorData = await response.json();
      //     throw new Error(errorData.message || 'Invalid promo code');
      //   } else {
      //     throw new Error('Server error. Please try again later.');
      //   }
      // }

      const data = await response.data;
      if (!data || typeof data.success !== "boolean" || !data.success) {
        throw new Error(data.message || "Invalid response format");
      }

      return data;
    } catch (error) {
      console.error("Promo code validation error:", error);
      throw new Error(
        error instanceof Error ? error.message : "Failed to validate promo code"
      );
    }
  };

  export const createPortalSession = async (customerId: any) => {
    try {
      const response = await fetcher("/api/stripe/create-stripe-portal", {
        method: "POST",
        data: { customerId },
      });

      if (!response.data || !response.data.url) {
        throw new Error("Failed to create portal session");
      }

      return response.data;
    } catch (error) {
      console.error("Error creating portal session:", error);
      throw new Error("Failed to create portal session");
    }
  };
}
