/***************************************************************
                NOTES
***************************************************************/
/*
- Component for collecting payment information
- Uses Stripe's CardElement for secure card input
- Handles promo code validation and application
- Maintains consistent styling with brand colors
*/

/***************************************************************
                IMPORTS
***************************************************************/
import { FC } from 'react';
import { CardElement } from '@stripe/react-stripe-js';

/***************************************************************
                Types
***************************************************************/
interface PaymentStepProps {
    formData: {
        cardHolder: string;
        promoCode: string;
    };
    handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => void;
    handlePromoCode: () => void;
    handleSubmit: (e: React.FormEvent) => void;
    promoState: {
        isValid: boolean;
        message: string;
        discount?: number;
        isChecking: boolean;
    };
    isProcessing: boolean;
    cardError?: string;
    onBack: () => void;
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
const PaymentStep: FC<PaymentStepProps> = ({
    formData,
    handleInputChange,
    handlePromoCode,
    handleSubmit,
    promoState,
    isProcessing,
    cardError,
    onBack
}) => {
    const cardElementOptions = {
        style: {
            base: {
                fontSize: '16px',
                color: '#F5F5DC',
                '::placeholder': {
                    color: '#F5F5DC80',
                },
            },
            invalid: {
                color: '#FF6B6B',
            },
        },
        hidePostalCode: true,
    };

    /***************************************************************
                    RENDER  
    ***************************************************************/
    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div>
                <label className="block text-sm font-medium text-brand-cream mb-2">
                    Card Holder Name
                </label>
                <input
                    type="text"
                    name="cardHolder"
                    value={formData.cardHolder}
                    onChange={handleInputChange}
                    className="w-full p-3 border border-brand-cream/20 rounded-lg bg-brand-cream/5 text-brand-cream placeholder-brand-cream/50 focus:outline-none focus:ring-2 focus:ring-brand-cream/20"
                    placeholder="Name on card"
                />
            </div>

            <div>
                <label className="block text-sm font-medium text-brand-cream mb-2">
                    Card Details
                </label>
                <div className="p-3 border border-brand-cream/20 rounded-lg bg-brand-cream/5">
                    <CardElement options={cardElementOptions} />
                </div>
                {cardError && (
                    <p className="text-red-400 text-sm mt-2">{cardError}</p>
                )}
            </div>

            <div>
                <label className="block text-sm font-medium text-brand-cream mb-2">
                    Promo Code (Optional)
                </label>
                <div className="flex gap-2">
                    <input
                        type="text"
                        name="promoCode"
                        value={formData.promoCode}
                        onChange={handleInputChange}
                        className="flex-1 p-3 border border-brand-cream/20 rounded-lg bg-brand-cream/5 text-brand-cream placeholder-brand-cream/50 focus:outline-none focus:ring-2 focus:ring-brand-cream/20"
                        placeholder="Enter promo code"
                    />
                    <button
                        type="button"
                        onClick={handlePromoCode}
                        disabled={promoState.isChecking}
                        className="px-4 py-3 bg-brand-cream/10 text-brand-cream rounded-lg hover:bg-brand-cream/20 transition-colors border border-brand-cream/20"
                    >
                        Apply
                    </button>
                </div>
                {promoState.message && (
                    <p className={`text-sm mt-2 ${promoState.isValid ? 'text-green-400' : 'text-red-400'}`}>
                        {promoState.message}
                    </p>
                )}
            </div>

            <div className="flex gap-4">
                <button
                    type="button"
                    onClick={onBack}
                    className="flex-1 py-3.5 px-4 bg-brand-cream/10 text-brand-cream font-semibold rounded-xl hover:bg-brand-cream/20 transition-all border border-brand-cream/20"
                >
                    Back
                </button>
                <button
                    type="submit"
                    disabled={isProcessing}
                    className="flex-1 py-3.5 px-4 bg-brand-logo text-brand-green-dark font-semibold rounded-xl hover:bg-brand-logo/90 transition-all hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-50 disabled:hover:translate-y-0 disabled:hover:shadow-none flex items-center justify-center"
                >
                    {isProcessing ? (
                        <>
                            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Processing...
                        </>
                    ) : (
                        'Start Free Trial'
                    )}
                </button>
            </div>
        </form>
    );
};

/***************************************************************
                EXPORTS
***************************************************************/
export default PaymentStep; 