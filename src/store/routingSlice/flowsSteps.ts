export const FROMULA_FLOW_STEPS: {
  [key: string]: string
} = {
  first: "first",
  second: "second",
}

export const formulaSteps: {
  [key: string]: {
    name: string
    previousStep: string
    nextStep: string
    number?: number
  }
} = {
  first: {
    name: FROMULA_FLOW_STEPS.first,
    previousStep: "",
    nextStep: FROMULA_FLOW_STEPS.second,
  },
  second: {
    name: FROMULA_FLOW_STEPS.second,
    previousStep: FROMULA_FLOW_STEPS.first,
    nextStep: "",
  },
}
