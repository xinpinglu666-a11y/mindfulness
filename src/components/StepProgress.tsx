interface StepProgressProps {
  steps: string[];
  currentStep: number;
}

export default function StepProgress({ steps, currentStep }: StepProgressProps) {
  return (
    <div className="flex items-center justify-between w-full px-2">
      {steps.map((step, i) => (
        <div key={i} className="flex items-center flex-1 last:flex-none">
          <div className="flex flex-col items-center">
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium transition-all duration-300 ${
                i <= currentStep
                  ? 'bg-forest text-white shadow-md'
                  : 'bg-warm/30 text-earth/40'
              }`}
            >
              {i < currentStep ? '✓' : i + 1}
            </div>
            <span
              className={`mt-2 text-xs whitespace-nowrap transition-colors duration-300 ${
                i <= currentStep ? 'text-earth/70 font-medium' : 'text-earth/30'
              }`}
            >
              {step}
            </span>
          </div>
          {i < steps.length - 1 && (
            <div className="flex-1 h-0.5 mx-1 mb-5">
              <div className="h-full bg-warm/30 rounded-full overflow-hidden">
                <div
                  className="h-full bg-forest rounded-full transition-all duration-500"
                  style={{ width: i < currentStep ? '100%' : '0%' }}
                />
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
