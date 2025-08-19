import { useContext } from 'react';
import StepFormContext from '../context/StepFormContext';

const useStepForm = () => {
  const context = useContext(StepFormContext);
  if (!context) {
    throw new Error('useStepForm must be used within StepFormProvider');
  }
  return context;
};

export default useStepForm;
