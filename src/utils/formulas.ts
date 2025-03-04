export type Formula = {
  id: string
  name: string
  variables: { key: string; name: string; unit: string }[]
  constants?: Record<string, { name: string; value: number }>
  description: string
  formulaViewMathJax: string
  calculate: (values: Partial<Record<string, number>>) => number
  reverse?: Record<string, (values: Partial<Record<string, number>>) => number>
}

export const formulas: Record<string, Formula> = {
  gravity: {
    id: "gravity",
    name: "Сила тяжести",
    variables: [
      { key: "F", name: "Сила", unit: "Н" },
      { key: "m", name: "Масса", unit: "кг" },
    ],
    constants: {
      g: { name: "Ускорение (м/с²)", value: 9.80665 },
    },
    description: "Формула силы тяжести",
    formulaViewMathJax: `\\(F = m \\cdot g\\)`,
    calculate: ({ m }) => {
      if (m === undefined) throw new Error("Не хватает данных")
      return m * 9.80665
    },
    reverse: {
      m: ({ F }) => {
        if (F === undefined) throw new Error("Не хватает данных")
        return F / 9.80665
      },
    },
  },
  kinetic_energy: {
    id: "kinetic_energy",
    name: "Кинетическая энергия",
    variables: [
      { key: "E", name: "Энергия", unit: "Дж" },
      { key: "m", name: "Масса", unit: "кг" },
      { key: "v", name: "Скорость", unit: "м/с" },
    ],
    description: "Формула кинетической энергии",
    formulaViewMathJax: "\\(E = \\frac{1}{2} m v^2\\)",
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
  potential_energy: {
    id: "potential_energy",
    name: "Потенциальная энергия",
    variables: [
      { key: "E", name: "Энергия", unit: "Дж" },
      { key: "m", name: "Масса", unit: "кг" },
      { key: "h", name: "Высота", unit: "м" },
    ],
    constants: {
      g: { name: "Ускорение (м/с²)", value: 9.80665 },
    },
    description: "Формула потенциальной энергии",
    formulaViewMathJax: "\\(E = m \\cdot g \\cdot h\\)",
    calculate: ({ m, h }) => {
      if (m === undefined || h === undefined)
        throw new Error("Не хватает данных")
      return m * 9.80665 * h
    },
    reverse: {
      m: ({ E, h }) => {
        if (E === undefined || h === undefined)
          throw new Error("Не хватает данных")
        return E / (9.80665 * h)
      },
      h: ({ E, m }) => {
        if (E === undefined || m === undefined)
          throw new Error("Не хватает данных")
        return E / (m * 9.80665)
      },
    },
  },
  ohms_law: {
    id: "ohms_law",
    name: "Закон Ома",
    variables: [
      { key: "V", name: "Напряжение", unit: "В" },
      { key: "I", name: "Ток", unit: "А" },
      { key: "R", name: "Сопротивление", unit: "Ом" },
    ],
    description: "Формула закона Ома",
    formulaViewMathJax: "\\(V = I \\cdot R\\)",
    calculate: ({ I, R }) => {
      if (I === undefined || R === undefined)
        throw new Error("Не хватает данных")
      return I * R
    },
    reverse: {
      I: ({ V, R }) => {
        if (V === undefined || R === undefined)
          throw new Error("Не хватает данных")
        return V / R
      },
      R: ({ V, I }) => {
        if (V === undefined || I === undefined)
          throw new Error("Не хватает данных")
        return V / I
      },
    },
  },
  work: {
    id: "work",
    name: "Работа",
    variables: [
      { key: "A", name: "Работа", unit: "Дж" },
      { key: "F", name: "Сила", unit: "Н" },
      { key: "d", name: "Расстояние", unit: "м" },
      { key: "theta", name: "Угол", unit: "рад" },
    ],
    description: "Формула работы",
    formulaViewMathJax: "\\(A = F \\cdot d \\cdot \\cos(\\theta)\\)",
    calculate: ({ F, d, theta }) => {
      if (F === undefined || d === undefined || theta === undefined)
        throw new Error("Не хватает данных")
      return F * d * Math.cos(theta)
    },
    reverse: {
      F: ({ A, d, theta }) => {
        if (A === undefined || d === undefined || theta === undefined)
          throw new Error("Не хватает данных")
        return A / (d * Math.cos(theta))
      },
      d: ({ A, F, theta }) => {
        if (A === undefined || F === undefined || theta === undefined)
          throw new Error("Не хватает данных")
        return A / (F * Math.cos(theta))
      },
      theta: ({ A, F, d }) => {
        if (A === undefined || F === undefined || d === undefined)
          throw new Error("Не хватает данных")
        return Math.acos(A / (F * d))
      },
    },
  },
  power: {
    id: "power",
    name: "Мощность",
    variables: [
      { key: "P", name: "Мощность", unit: "Вт" },
      { key: "A", name: "Работа", unit: "Дж" },
      { key: "t", name: "Время", unit: "с" },
    ],
    description: "Формула мощности",
    formulaViewMathJax: "\\(P = \\frac{A}{t}\\)",
    calculate: ({ A, t }) => {
      if (A === undefined || t === undefined)
        throw new Error("Не хватает данных")
      return A / t
    },
    reverse: {
      A: ({ P, t }) => {
        if (P === undefined || t === undefined)
          throw new Error("Не хватает данных")
        return P * t
      },
      t: ({ P, A }) => {
        if (P === undefined || A === undefined)
          throw new Error("Не хватает данных")
        return A / P
      },
    },
  },
  speed: {
    id: "speed",
    name: "Скорость",
    variables: [
      { key: "v", name: "Скорость", unit: "м/с" },
      { key: "d", name: "Расстояние", unit: "м" },
      { key: "t", name: "Время", unit: "с" },
    ],
    description: "Формула скорости",
    formulaViewMathJax: "\\(v = \\frac{d}{t}\\)",
    calculate: ({ d, t }) => {
      if (d === undefined || t === undefined)
        throw new Error("Не хватает данных")
      return d / t
    },
    reverse: {
      d: ({ v, t }) => {
        if (v === undefined || t === undefined)
          throw new Error("Не хватает данных")
        return v * t
      },
      t: ({ v, d }) => {
        if (v === undefined || d === undefined)
          throw new Error("Не хватает данных")
        return d / v
      },
    },
  },
  density: {
    id: "density",
    name: "Плотность",
    variables: [
      { key: "rho", name: "Плотность", unit: "кг/м³" },
      { key: "m", name: "Масса", unit: "кг" },
      { key: "V", name: "Объём", unit: "м³" },
    ],
    description: "Формула плотности",
    formulaViewMathJax: "\\(\\rho = \\frac{m}{V}\\)",
    calculate: ({ m, V }) => {
      if (m === undefined || V === undefined)
        throw new Error("Не хватает данных")
      return m / V
    },
    reverse: {
      m: ({ rho, V }) => {
        if (rho === undefined || V === undefined)
          throw new Error("Не хватает данных")
        return rho * V
      },
      V: ({ rho, m }) => {
        if (rho === undefined || m === undefined)
          throw new Error("Не хватает данных")
        return m / rho
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

  // Включаем константы в knownValues
  if (formula.constants) {
    for (const key in formula.constants) {
      knownValues[key] = formula.constants[key].value
    }
  }

  if (targetVariable === formula.variables[0].key) {
    return formula.calculate(knownValues)
  } else if (formula.reverse?.[targetVariable]) {
    return formula.reverse[targetVariable](knownValues)
  }

  throw new Error(`Невозможно вычислить ${targetVariable}`)
}
