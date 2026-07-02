import {
  Stepper,
  StepperIndicator,
  StepperItem,
  StepperSeparator,
  StepperTitle,
} from '@/registry/ui/stepper'

const steps = ['Account', 'Profile', 'Confirm']

export default function Demo() {
  return (
    <Stepper activeStep={1} className="max-w-xl">
      {steps.map((label, index) => (
        <StepperItem key={label} step={index}>
          <StepperIndicator />
          <StepperTitle>{label}</StepperTitle>
          <StepperSeparator />
        </StepperItem>
      ))}
    </Stepper>
  )
}
