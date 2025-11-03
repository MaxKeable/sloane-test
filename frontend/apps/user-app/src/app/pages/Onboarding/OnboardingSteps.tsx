export default function OnboardingSteps({ isComplete }: { isComplete?: boolean }) {
  return (
    <div className="absolute top-16 md:top-12 left-0 right-0 flex justify-center px-2">
      <div className="flex items-center space-x-1 sm:space-x-2 md:space-x-4 overflow-x-auto max-w-full ">
        <div className="flex items-center shrink-0">
          <div className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 rounded-full bg-brand-cream text-brand-green flex items-center justify-center text-[10px] sm:text-xs md:text-sm font-medium">
            1
          </div>
          <span className="ml-1 sm:ml-1 md:ml-2 text-brand-cream text-[10px] sm:text-xs md:text-sm whitespace-nowrap">
            Account
          </span>
        </div>
        <div className="w-2 sm:w-4 md:w-8 h-[2px] bg-brand-cream mt-[1px] shrink-0" />
        <div className="flex items-center shrink-0">
          <div className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 rounded-full bg-brand-cream text-brand-green flex items-center justify-center text-[10px] sm:text-xs md:text-sm font-medium">
            2
          </div>
          <span className="ml-1 sm:ml-1 md:ml-2 text-brand-cream text-[10px] sm:text-xs md:text-sm whitespace-nowrap">
            Subscription
          </span>
        </div>
        <div className="w-2 sm:w-4 md:w-8 h-[2px] bg-brand-cream mt-[1px] shrink-0" />
        <div className="flex items-center shrink-0">
          <div className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 rounded-full bg-brand-cream text-brand-green flex items-center justify-center text-[10px] sm:text-xs md:text-sm font-medium">
            3
          </div>
          <span className="ml-1 sm:ml-1 md:ml-2 text-brand-cream text-[10px] sm:text-xs md:text-sm font-medium whitespace-nowrap">
            Interview
          </span>
        </div>
        <div className="w-2 sm:w-4 md:w-8 h-[2px] bg-brand-cream mt-[1px] shrink-0" />
        <div className="flex items-center shrink-0">
          <div className={`w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 rounded-full flex items-center justify-center text-[10px] sm:text-xs md:text-sm font-medium
            ${isComplete ? 'bg-brand-cream text-brand-green' : 'border-2 border-brand-cream text-brand-cream'}`}>
            4
          </div>
          <span className={`ml-1 sm:ml-1 md:ml-2 text-brand-cream text-[10px] sm:text-xs md:text-sm whitespace-nowrap
            ${isComplete ? 'font-medium' : ''}`}>
            Start
          </span>
        </div>
      </div>
    </div>
  );
}
