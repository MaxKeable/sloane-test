/***************************************************************
                NOTES
***************************************************************/
/*
- Welcome section component for the left side of the subscription page
- Shows logo, welcome message, and action buttons
- Handles login and payment update actions
- Maintains consistent styling with brand colors
*/

/***************************************************************
                IMPORTS
***************************************************************/
import { FC, RefObject, useState } from 'react';
import { Link } from 'react-router-dom';

/***************************************************************
                Types
***************************************************************/
interface WelcomeSectionProps {
    onTroubleLogin: () => void;
    onUpdatePayment: () => void;
    isUpdatingPayment: boolean;
    stripeCustomerId?: string;
    troubleLoginRef: RefObject<HTMLAnchorElement>;
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
const WelcomeSection: FC<WelcomeSectionProps> = ({
    onTroubleLogin,
    onUpdatePayment,
    isUpdatingPayment,
    stripeCustomerId,
    troubleLoginRef,
}) => {
    const [showExistingUserOptions, setShowExistingUserOptions] = useState(false);

    /***************************************************************
                    RENDER  
    ***************************************************************/
    return (
        <div className="order-last w-full lg:w-1/2 min-h-screen md:h-screen relative flex flex-col justify-center items-center">
            <div className="absolute inset-0 bg-gradient-to-br from-brand-green-dark via-brand-green-dark to-brand-logo/20"></div>
            <div className="relative z-10 flex flex-col justify-center items-center p-4 md:p-6 pt-24 md:pt-16 h-full">
                <div className="w-full max-w-md flex flex-col items-center">
                    <div className="text-center">
                        <img
                            src="/images/mock.png"
                            alt="Sloane"
                            className="w-full mx-auto"
                        />
                    </div>

                    <div className="flex flex-col space-y-4 w-full max-w-sm mt-8">
                        {!showExistingUserOptions ? (
                            <button
                                onClick={() => setShowExistingUserOptions(true)}
                                className="w-full px-6 py-3.5 rounded-xl bg-brand-cream/10 text-brand-cream font-semibold text-center transition-all hover:bg-brand-cream/20 border border-brand-cream/20"
                            >
                                Existing Users
                            </button>
                        ) : (
                            <>
                                <Link
                                    to="/"
                                    className="group w-full px-6 py-3.5 rounded-xl bg-brand-cream/95 text-brand-green font-semibold text-center transition-all hover:bg-brand-cream hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0"
                                >
                                    <span className="flex items-center justify-center">
                                        Login to Dashboard
                                        <svg className="w-5 h-5 ml-2 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                                        </svg>
                                    </span>
                                </Link>

                                <Link
                                    to="/trouble-login"
                                    className="w-full px-6 py-3.5 rounded-xl bg-brand-cream/10 text-brand-cream font-semibold text-center transition-all hover:bg-brand-cream/20 border border-brand-cream/20"
                                    ref={troubleLoginRef}
                                    onClick={e => { e.preventDefault(); onTroubleLogin(); }}
                                >
                                    Trouble Logging In?
                                </Link>

                                <button
                                    type="button"
                                    onClick={onUpdatePayment}
                                    className="w-full px-6 py-3.5 rounded-xl bg-brand-cream/10 text-brand-cream font-semibold text-center transition-all hover:bg-brand-cream/20 border border-brand-cream/20 flex items-center justify-center"
                                    disabled={!stripeCustomerId || isUpdatingPayment}
                                >
                                    {isUpdatingPayment && (
                                        <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-brand-cream" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                    )}
                                    Update Payment Details
                                </button>
                            </>
                        )}
                    </div>

                    <div className="mt-12 text-center">
                        <p className="text-brand-cream/60 text-sm">
                            Need help? <a href="mailto:hello@sloane.biz?subject=Support%20Request" className="text-brand-cream hover:underline">Contact Support</a>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

/***************************************************************
                EXPORTS
***************************************************************/
export default WelcomeSection; 