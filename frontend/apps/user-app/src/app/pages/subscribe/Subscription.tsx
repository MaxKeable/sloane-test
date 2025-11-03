import { FC, useState, useRef } from "react";
import { loadStripe } from "@stripe/stripe-js";
import {
  Elements,
  useStripe,
  useElements,
  CardElement,
} from "@stripe/react-stripe-js";
import { StripeService } from "../../../services/stripe";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { useUserContext } from "../../../providers/user-provider";
import { QUERY_KEYS } from "../../../constants/queryKeys";
import WelcomeSection from "./WelcomeSection";
import PaymentSection from "./PaymentSection";
import TroubleLoginModal from "./TroubleLoginModal";

interface PaymentFormData {
  cardHolder: string;
  promoCode: string;
  country: string;
  address?: string;
}

interface PromoCodeState {
  isValid: boolean;
  message: string;
  discount?: number;
  isChecking: boolean;
}

const STRIPE_KEY = import.meta.env.VITE_STRIPE_PUBLIC_KEY;

const stripePromise = STRIPE_KEY
  ? loadStripe(STRIPE_KEY).catch((err) => {
      console.error("Failed to load Stripe:", err);
      return null;
    })
  : null;

const Subscription: FC = () => {
  const navigate = useNavigate();
  const stripe = useStripe();
  const elements = useElements();
  const paymentSectionRef = useRef<HTMLDivElement>(null!);
  const troubleLoginRef = useRef<HTMLAnchorElement>(null!);
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<PaymentFormData>({
    cardHolder: "",
    promoCode: "",
    country: "AU",
  });
  const [errors, setErrors] = useState<Partial<PaymentFormData>>({});
  const [isProcessing, setIsProcessing] = useState(false);
  const [cardError, setCardError] = useState<string | undefined>(undefined);
  const [addressComplete, setAddressComplete] = useState(false);
  const [promoState, setPromoState] = useState<PromoCodeState>({
    isValid: false,
    message: "",
    discount: 0,
    isChecking: false,
  });
  const [isTroubleModalOpen, setIsTroubleModalOpen] = useState(false);
  const [isUpdatingPayment, setIsUpdatingPayment] = useState(false);

  // Get user data from context
  const { user: userData } = useUserContext();
  const stripeCustomerId = userData?.stripeCustomerId;

  const validateForm = () => {
    const newErrors: Partial<PaymentFormData> = {};

    if (!formData.cardHolder.trim()) {
      newErrors.cardHolder = "Card holder name is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name as keyof PaymentFormData]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) {
      console.error("Stripe.js hasn't loaded yet.");
      return;
    }

    if (validateForm()) {
      setIsProcessing(true);
      try {
        const response: any = await StripeService.createSubscription({
          promoCode: formData.promoCode || undefined,
        });

        if (!response.requiresPayment) {
          navigate("/dashboard", {
            replace: true,
            state: {
              paymentSuccess: true,
              message: "Welcome to Sloane!",
            },
          });
          return;
        }

        const cardElement = elements.getElement(CardElement);
        if (!cardElement) {
          throw new Error("Card element not found");
        }

        if (response.requiresSetup && response.setupClientSecret) {
          const { error: setupError, setupIntent } =
            await stripe.confirmCardSetup(response.setupClientSecret, {
              payment_method: {
                card: cardElement,
                billing_details: { name: formData.cardHolder },
              },
            });

          if (setupError) {
            setCardError(setupError.message || "Failed to save payment method");
            throw new Error(setupError.message);
          }

          await StripeService.finalizeSubscription(
            response.subscriptionId,
            setupIntent?.id
          );
        } else if (response.clientSecret) {
          const { error: confirmError } = await stripe.confirmCardPayment(
            response.clientSecret,
            {
              payment_method: {
                card: cardElement,
                billing_details: { name: formData.cardHolder },
              },
            }
          );

          if (confirmError) {
            setCardError(confirmError.message);
            throw new Error(confirmError.message);
          }

          await StripeService.finalizeSubscription(response.subscriptionId);
        } else {
          throw new Error("Invalid subscription response");
        }

        navigate("/dashboard", {
          replace: true,
          state: {
            paymentSuccess: true,
            message: "Welcome to Sloane!",
          },
        });
      } catch (error) {
        console.error("Payment processing failed:", error);
        setErrors((prev) => ({
          ...prev,
          cardNumber:
            error instanceof Error
              ? error.message
              : "Payment processing failed. Please try again.",
        }));
      } finally {
        setIsProcessing(false);
      }
    }
  };

  const handlePromoCode = async () => {
    if (!formData.promoCode.trim()) {
      setPromoState({
        isValid: false,
        message: "Please enter a promo code",
        isChecking: false,
      });
      return;
    }

    setPromoState((prev) => ({ ...prev, isChecking: true, message: "" }));

    try {
      const response = await StripeService.validatePromoCode(
        formData.promoCode
      );
      setPromoState({
        isValid: true,
        message: "Promo code applied successfully!",
        discount: response.discount,
        isChecking: false,
      });
    } catch (error) {
      console.error("Promo code validation error:", error);
      setPromoState({
        isValid: false,
        message: "Invalid promo code or server error. Please try again.",
        isChecking: false,
      });
    }
  };

  const handleAddressChange = (event: any) => {
    if (event.complete) {
      setAddressComplete(true);
      setFormData((prev) => ({
        ...prev,
        country: event.value.address.country,
      }));
    } else {
      setAddressComplete(false);
    }
  };

  const handleNextStep = () => {
    if (addressComplete) {
      setCurrentStep(2);
    } else {
      setErrors({
        country: "Please complete your billing address",
      });
    }
  };

  const handleBackStep = () => {
    setCurrentStep(1);
  };

  const handleScrollToPayment = () => {
    if (troubleLoginRef.current) {
      troubleLoginRef.current.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }
  };

  const handleUpdatePayment = async () => {
    setIsUpdatingPayment(true);
    try {
      const data: any =
        await StripeService.createPortalSession(stripeCustomerId);
      if (data.url) {
        window.location.href = data.url;
      }
    } catch (error) {
      console.error("Error redirecting to Stripe portal:", error);
      alert("Error opening portal. Please try again.");
    } finally {
      setIsUpdatingPayment(false);
    }
  };

  /***************************************************************
                  RENDER  
  ***************************************************************/
  return (
    <>
      <div className="min-h-screen flex flex-col md:flex-row relative bg-brand-green-dark textarea1-scrollbar overflow-y-auto">
        <TroubleLoginModal
          isOpen={isTroubleModalOpen}
          onClose={() => setIsTroubleModalOpen(false)}
          onUpdatePayment={handleUpdatePayment}
          isUpdatingPayment={isUpdatingPayment}
          stripeCustomerId={stripeCustomerId}
        />

        <WelcomeSection
          onTroubleLogin={() => setIsTroubleModalOpen(true)}
          onUpdatePayment={handleUpdatePayment}
          isUpdatingPayment={isUpdatingPayment}
          stripeCustomerId={stripeCustomerId}
          troubleLoginRef={troubleLoginRef}
        />

        <PaymentSection
          currentStep={currentStep}
          formData={formData}
          promoState={promoState}
          isProcessing={isProcessing}
          cardError={cardError}
          paymentSectionRef={paymentSectionRef}
          handleInputChange={handleInputChange}
          handleAddressChange={handleAddressChange}
          handlePromoCode={handlePromoCode}
          handleSubmit={handleSubmit}
          handleNextStep={handleNextStep}
          handleBackStep={handleBackStep}
          handleScrollToPayment={handleScrollToPayment}
        />
      </div>
    </>
  );
};

const SubscriptionWrapper: FC = () => {
  return (
    <Elements stripe={stripePromise}>
      <Subscription />
    </Elements>
  );
};

export default SubscriptionWrapper;
