export type Formula = {
  id: string
  name: string
  variables: { key: string; name: string }[]
  description: string
  calculate: (values: Partial<Record<string, number>>) => number
  reverse?: Record<string, (values: Partial<Record<string, number>>) => number>
}

export const formulas: Record<string, Formula> = {
  gravity: {
    id: "gravity",
    name: "Сила тяжести",
    variables: [
      { key: "F", name: "Сила (Н)" },
      { key: "m", name: "Масса (кг)" },
      { key: "g", name: "Ускорение (м/с²)" },
    ],
    description: "Формула силы тяжести: F = m * g",
    calculate: ({ m, g }) => {
      if (m === undefined || g === undefined)
        throw new Error("Не хватает данных")
      return m * g
    },
    reverse: {
      m: ({ F, g }) => {
        if (F === undefined || g === undefined)
          throw new Error("Не хватает данных")
        return F / g
      },
      g: ({ F, m }) => {
        if (F === undefined || m === undefined)
          throw new Error("Не хватает данных")
        return F / m
      },
    },
  },
  kinetic_energy: {
    id: "kinetic_energy",
    name: "Кинетическая энергия",
    variables: [
      { key: "E", name: "Энергия (Дж)" },
      { key: "m", name: "Масса (кг)" },
      { key: "v", name: "Скорость (м/с)" },
    ],
    description: "Формула кинетической энергии: E = ½ * m * v²",
    calculate: ({ m, v }) => {
      if (m === undefined || v === undefined)
        throw new Error("Не хватает данных")
      return 0.5 * m * v ** 2
    },
    reverse: {
      m: ({ E, v }) => {
        if (E === undefined || v === undefined)
          throw new Error("Не хватает данных")
        return (2 * E) / v ** 2
      },
      v: ({ E, m }) => {
        if (E === undefined || m === undefined)
          throw new Error("Не хватает данных")
        return Math.sqrt((2 * E) / m)
      },
    },
  },
}

export function getFormula(id: string): Formula | undefined {
  return formulas[id]
}

export function calculateVariable(
  formulaId: string,
  knownValues: Partial<Record<string, number>>,
  targetVariable: string,
) {
  const formula = getFormula(formulaId)
  if (!formula) throw new Error("Формула не найдена")

  if (targetVariable === formula.variables[0].key) {
    return formula.calculate(knownValues)
  } else if (formula.reverse?.[targetVariable]) {
    return formula.reverse[targetVariable](knownValues)
  }

  throw new Error(`Невозможно вычислить ${targetVariable}`)
}
