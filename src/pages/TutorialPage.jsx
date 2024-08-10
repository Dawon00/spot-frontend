import React from "react";
import WideButton from "../components/WideButton";
import { currentStepState } from "../atom/tutorialState";
import { useRecoilState } from "recoil";
import Step0 from "../components/tutorial/Step0";
import Step1 from "../components/tutorial/Step1";
import Step2 from "../components/tutorial/Step2";
import Step3 from "../components/tutorial/Step3";
import Step4 from "../components/tutorial/Step4";
import Step5 from "../components/tutorial/Step5";
import Step6 from "../components/tutorial/Step6";
import Step7 from "../components/tutorial/Step7";
import Step8 from "../components/tutorial/Step8";
import Step9 from "../components/tutorial/Step9";

function TutorialPage() {
  const [currentStep, setCurrentStep] = useRecoilState(currentStepState);

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const steps = [
    <Step0 />,
    <Step1 />,
    <Step2 />,
    <Step3 />,
    <Step4 />,
    <Step5 />,
    <Step6 onRouteChange={handleNext} />,
    <Step7 />,
    <Step8 />,
    <Step9 />,
  ];

  const buttonText =
    currentStep === steps.length - 2
      ? "완료하기"
      : currentStep === 0
      ? "시작"
      : "다음";

  return (
    <div className="w-full min-h-screen bg-black relative overflow-hidden">
      {steps.map((step, index) => (
        <div
          key={index}
          className={`absolute inset-0 transition-opacity duration-300 ease-in-out ${
            currentStep === index ? "opacity-100 z-10" : "opacity-0 z-0"
          }`}
        >
          {step}
        </div>
      ))}
      {currentStep !== 6 && currentStep < steps.length - 1 && (
        <div className="fixed bottom-5 left-0 right-0  w-full flex justify-center p-4 z-50">
          <WideButton onClick={handleNext}>{buttonText}</WideButton>
        </div>
      )}
    </div>
  );
}

export default TutorialPage;
