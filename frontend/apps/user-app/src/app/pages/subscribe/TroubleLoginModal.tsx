/***************************************************************
                NOTES
***************************************************************/
/*
- Modal component for handling login issues
- Provides options to update payment details or contact support
- Maintains consistent styling with brand colors
- Handles loading states for payment updates
*/

/***************************************************************
                IMPORTS
***************************************************************/
import { FC } from 'react';
import Modal from '../Dashboard/Modal';

/***************************************************************
                Types
***************************************************************/
interface TroubleLoginModalProps {
    isOpen: boolean;
    onClose: () => void;
    onUpdatePayment: () => void;
    isUpdatingPayment: boolean;
    stripeCustomerId?: string;
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
const TroubleLoginModal: FC<TroubleLoginModalProps> = ({
    isOpen,
    onClose,
    onUpdatePayment,
    isUpdatingPayment,
    stripeCustomerId
}) => {
    /***************************************************************
                    RENDER  
    ***************************************************************/
    return (
        <Modal isOpen={isOpen} onClose={onClose}>
            <div className="flex flex-col items-center gap-6">
                <h2 className="text-2xl font-bold text-brand-cream mb-2 text-center">Trouble Logging In?</h2>
                <p className="text-brand-cream/90 text-center text-lg">
                    If you've landed here and already have an account, it means your Stripe payment hasn't been processed yet.<br />
                    This usually means your credit card needs updating or there are insufficient funds in your chosen account.<br /><br />
                    No worries! You can update your payment details below, or reach out to us for help.
                </p>
                <button
                    type="button"
                    onClick={onUpdatePayment}
                    className="w-full px-6 py-3.5 rounded-xl bg-brand-cream text-brand-green font-semibold text-center transition-all hover:bg-brand-cream/90 border border-brand-green/20 flex items-center justify-center"
                    disabled={!stripeCustomerId || isUpdatingPayment}
                >
                    {isUpdatingPayment && (
                        <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-brand-green" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                    )}
                    Update Payment Details
                </button>
                <a
                    href="mailto:hello@sloane.biz?subject=Support%20Request"
                    className="w-full px-6 py-3.5 rounded-xl border border-brand-cream text-brand-cream font-semibold text-center transition-all hover:bg-brand-cream/10 mt-2"
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    Contact Support
                </a>
            </div>
        </Modal>
    );
};

/***************************************************************
                EXPORTS
***************************************************************/
export default TroubleLoginModal; 