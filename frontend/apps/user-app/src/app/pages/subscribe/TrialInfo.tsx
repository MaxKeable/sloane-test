/***************************************************************
                NOTES
***************************************************************/
/*
- Component for displaying trial information and pricing
- Shows trial duration, cancellation policy, and pricing
- Includes Stripe branding
- Maintains consistent styling with brand colors
*/

/***************************************************************
                IMPORTS
***************************************************************/
import { FC } from 'react';

/***************************************************************
                Types
***************************************************************/
interface TrialInfoProps {
    onScrollToPayment: () => void;
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
const TrialInfo: FC<TrialInfoProps> = ({ onScrollToPayment }) => {
    /***************************************************************
                    RENDER  
    ***************************************************************/
    return (
        <div className="text-center mb-8 w-full">
            
            {/* Trial Info Banner with Gradient */}
            <div className="w-[90%] mx-auto p-4 mb-4">
            <h2 className="text-2xl font-semibold text-center mb-4 text-brand-cream">New Users</h2>
                <div className="inline-block px-12 py-4 mb-4 rounded-full bg-gradient-to-br from-brand-logo/10 via-brand-green to-brand-logo/50 border border-brand-cream text-brand-cream text-lg font-semibold tracking-wide uppercase shadow-sm">
                    Start 14-Day Free Trial
                </div>
                <div className="md:hidden text-xs text-brand-cream/80 mb-3">
                    Already a member?{' '}
                    <button type="button" className="underline text-brand-logo font-semibold" onClick={onScrollToPayment}>
                        Click Here
                    </button>
                </div>
                <div className="max-w-lg mx-auto flex flex-col items-center gap-3 shadow-sm">
                    {/* <div className="flex items-center gap-2">
                        <span className="text-brand-cream/80 font-medium">You won't be charged until your trial ends. Cancel anytime! </span>
                    </div> */}
                    <div className="flex items-center gap-2">
                        <span className="text-brand-cream/80 font-light">Card required for verification only. <br />No charge during the trial period. Cancel anytime!</span>
                    </div>
                </div>
            </div>
            {/* divider */}
            <div className="w-3/4 mx-auto h-[1px] bg-brand-logo/50 my-4"></div>
            {/* After trial info below the banner */}
            <div className="w-full text-center mb-4">
                <span className="text-sm text-brand-cream/70">After your trial, continue for $79 AUD per month.</span>
            </div>
            {/* <div className="flex items-center justify-center my-2">
                <span className="text-xs text-brand-cream/80 mr-2">Powered by</span>
                <svg width="60" height="20" viewBox="0 0 60 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <text x="0" y="15" fontFamily="Arial, Helvetica, sans-serif" fontWeight="bold" fontSize="16" fill="#635BFF">Stripe</text>
                </svg>
            </div> */}
        </div>
    );
};

/***************************************************************
                EXPORTS
***************************************************************/
export default TrialInfo; 