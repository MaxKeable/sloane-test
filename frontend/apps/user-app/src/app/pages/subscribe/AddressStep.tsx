/***************************************************************
                NOTES
***************************************************************/
/*
- Component for collecting billing address information
- Uses Stripe's AddressElement for address collection
- Handles address validation and completion
- Maintains consistent styling with brand colors
*/

/***************************************************************
                IMPORTS
***************************************************************/
import { FC } from 'react';
import { AddressElement } from '@stripe/react-stripe-js';

/***************************************************************
                Types
***************************************************************/
interface AddressStepProps {
    formData: {
        country: string;
    };
    handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => void;
    handleAddressChange: (event: any) => void;
    onNext: () => void;
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
const AddressStep: FC<AddressStepProps> = ({ formData, handleInputChange, handleAddressChange, onNext }) => {
    /***************************************************************
                    RENDER  
    ***************************************************************/
    return (
        <div className="space-y-6 px-8 lg:px-0">
            <div className="relative">
                <label className="block text-sm font-medium text-brand-cream mb-2">
                    Billing Address
                </label>
                <div className="p-3 border border-brand-cream/20 rounded-lg bg-brand-cream/30">
                    <AddressElement
                        options={{
                            mode: 'billing',
                            allowedCountries: ['AU', 'US', 'GB', 'CA', 'JP', 'DE', 'FR', 'IT', 'ES', 'NL', 'BE', 'SE', 'NO', 'DK', 'FI', 'IE', 'AT', 'CH', 'PT', 'GR', 'PL', 'CZ', 'HU', 'SK', 'RO', 'BG', 'HR', 'SI', 'EE', 'LV', 'LT', 'CY', 'MT', 'LU', 'IS', 'LI', 'MC', 'SM', 'VA', 'AD', 'GI', 'IM', 'JE', 'GG', 'AX', 'FO', 'GL', 'PM', 'WF', 'PF', 'NC', 'RE', 'YT', 'BL', 'MF', 'GP', 'MQ', 'GF', 'TF', 'PF', 'NC', 'RE', 'YT', 'BL', 'MF', 'GP', 'MQ', 'GF', 'TF'],
                            defaultValues: {
                                address: {
                                    country: formData.country
                                }
                            },
                            fields: {
                                phone: 'never'
                            }
                        }}
                        onChange={handleAddressChange}
                        className="relative [&_label]:text-brand-cream [&_input]:text-brand-cream [&_select]:text-brand-cream [&_input::placeholder]:text-brand-cream/50"
                    />
                </div>
            </div>

            <button
                type="button"
                onClick={onNext}
                className="w-full py-3.5 px-4 bg-brand-cream text-brand-green font-semibold rounded-xl hover:bg-brand-cream/90 transition-all hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0"
            >
                Continue
            </button>
            <div className="flex items-center justify-center my-2">
                <span className="text-xs text-brand-cream/80 mr-2">Powered by</span>
                <svg width="60" height="20" viewBox="0 0 60 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <text x="0" y="15" fontFamily="Arial, Helvetica, sans-serif" fontWeight="bold" fontSize="16" fill="#635BFF">Stripe</text>
                </svg>
            </div>
        </div>
    );
};

/***************************************************************
                EXPORTS
***************************************************************/
export default AddressStep; 