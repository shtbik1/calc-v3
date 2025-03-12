type ScenarioSteps = {
  currentStep: string
  initStep: string
  steps: {
    [key: string]: {
      name: string
      previousStep: string | null
      nextStep: string | null
    }
  }
}

export type TFlowName = "formulaFlow"

export type TRoutingType = {
  currentFlow: TFlowName | ""
  routes: {
    formulaFlow: ScenarioSteps
  }
}
