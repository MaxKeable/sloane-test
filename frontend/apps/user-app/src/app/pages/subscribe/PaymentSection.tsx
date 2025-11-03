/***************************************************************
                NOTES
***************************************************************/
/*
- Payment section component handling both business details and payment flow
- Shows business details form first, then payment details
- Maintains consistent styling with brand colors
*/

/***************************************************************
                IMPORTS
***************************************************************/
import { FC, RefObject } from "react";
import TrialInfo from "./TrialInfo";
import AddressStep from "./AddressStep";
import PaymentStep from "./PaymentStep";

/***************************************************************
                Types
***************************************************************/
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

interface PaymentSectionProps {
  currentStep: number;
  formData: PaymentFormData;
  promoState: PromoCodeState;
  isProcessing: boolean;
  cardError?: string;
  paymentSectionRef: RefObject<HTMLDivElement>;
  handleInputChange: (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => void;
  handleAddressChange: (event: any) => void;
  handlePromoCode: () => void;
  handleSubmit: (e: React.FormEvent) => void;
  handleNextStep: () => void;
  handleBackStep: () => void;
  handleScrollToPayment: () => void;
}

/***************************************************************
                Hooks
***************************************************************/
// No custom hooks needed

/***************************************************************
                Functions
***************************************************************/
// No utility functions needed

/***************************************************************
                Components
***************************************************************/
const PaymentSection: FC<PaymentSectionProps> = ({
  currentStep,
  formData,
  promoState,
  isProcessing,
  cardError,
  paymentSectionRef,
  handleInputChange,
  handleAddressChange,
  handlePromoCode,
  handleSubmit,
  handleNextStep,
  handleBackStep,
  handleScrollToPayment,
}) => {
  /***************************************************************
                    RENDER  
    ***************************************************************/
  return (
    <div
      ref={paymentSectionRef}
      className="order-first flex flex-col items-center justify-start md:justify-center pt-24 md:pt-16 w-full lg:w-1/2 px-8 xl:px-0 bg-brand-green"
    >
      <div className="w-full xl:w-3/4 rounded-xl backdrop-blur-sm my-4 relative">
        <TrialInfo onScrollToPayment={handleScrollToPayment} />
        <div className="w-full lg:w-full mx-auto">
          {currentStep === 1 ? (
            <AddressStep
              formData={formData}
              handleInputChange={handleInputChange}
              handleAddressChange={handleAddressChange}
              onNext={handleNextStep}
            />
          ) : (
            <PaymentStep
              formData={formData}
              handleInputChange={handleInputChange}
              handlePromoCode={handlePromoCode}
              handleSubmit={handleSubmit}
              promoState={promoState}
              isProcessing={isProcessing}
              cardError={cardError}
              onBack={handleBackStep}
            />
          )}
        </div>
      </div>
    </div>
  );
};

/***************************************************************
                EXPORTS
***************************************************************/
export default PaymentSection;
