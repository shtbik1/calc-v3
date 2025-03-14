export type Formula = {
  id: string
  name: string
  variables: { key: string; name: string; unit: string }[]
  constants?: Record<string, { name: string; value: number }>
  description: string
  formulaViewMathJax: string
  calculate: (values: Partial<Record<string, number>>) => number
  reverse?: Record<string, (values: Partial<Record<string, number>>) => number>
  units?: Record<string, string[]>
  conversionFactors?: Record<string, Record<string, number>>
  category: string
}

export const formulas: Record<string, Formula> = {
  gravity: {
    id: "gravity",
    name: "Сила тяжести",
    category: "Механика",
    variables: [
      { key: "F", name: "Сила", unit: "Н" },
      { key: "m", name: "Масса", unit: "Кг" },
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
    units: {
      m: ["Кг", "тонны", "граммы", "мг"],
      F: ["Н", "КН", "мН"],
    },
    conversionFactors: {
      m: {
        Кг: 1,
        тонны: 1000,
        граммы: 0.001,
        мг: 0.000001,
      },
      F: {
        Н: 1,
        КН: 1000,
        мН: 0.001,
      },
    },
  },
  kinetic_energy: {
    id: "kinetic_energy",
    name: "Кинетическая энергия",
    category: "Механика",
    variables: [
      { key: "E", name: "Энергия", unit: "Дж" },
      { key: "m", name: "Масса", unit: "Кг" },
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
    units: {
      E: ["Дж", "кДж", "мДж"],
      m: ["Кг", "тонны", "граммы", "мг"],
      v: ["м/с", "км/ч", "миль/ч"],
    },
    conversionFactors: {
      E: {
        Дж: 1,
        кДж: 1000,
        мДж: 0.001,
      },
      m: {
        Кг: 1,
        тонны: 1000,
        граммы: 0.001,
        мг: 0.000001,
      },
      v: {
        "м/с": 1,
        "км/ч": 0.277778,
        "миль/ч": 0.44704,
      },
    },
  },
  potential_energy: {
    id: "potential_energy",
    name: "Потенциальная энергия",
    category: "Механика",
    variables: [
      { key: "E", name: "Энергия", unit: "Дж" },
      { key: "m", name: "Масса", unit: "Кг" },
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
    units: {
      E: ["Дж", "кДж", "мДж"],
      m: ["Кг", "тонны", "граммы", "мг"],
      h: ["м", "км", "см"],
    },
    conversionFactors: {
      E: {
        Дж: 1,
        кДж: 1000,
        мДж: 0.001,
      },
      m: {
        Кг: 1,
        тонны: 1000,
        граммы: 0.001,
        мг: 0.000001,
      },
      h: {
        м: 1,
        км: 1000,
        см: 0.01,
      },
    },
  },
  ohms_law: {
    id: "ohms_law",
    name: "Закон Ома",
    category: "Электродинамика",
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
    units: {
      V: ["В", "кВ", "мВ"],
      I: ["А", "мА", "кА"],
      R: ["Ом", "кОм", "мОм"],
    },
    conversionFactors: {
      V: {
        В: 1,
        кВ: 1000,
        мВ: 0.001,
      },
      I: {
        А: 1,
        мА: 0.001,
        кА: 1000,
      },
      R: {
        Ом: 1,
        кОм: 1000,
        мОм: 0.001,
      },
    },
  },
  work: {
    id: "work",
    name: "Работа",
    category: "Механика",
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
    units: {
      A: ["Дж", "кДж", "мДж"],
      F: ["Н", "КН", "мН"],
      d: ["м", "км", "см"],
    },
    conversionFactors: {
      A: {
        Дж: 1,
        кДж: 1000,
        мДж: 0.001,
      },
      F: {
        Н: 1,
        КН: 1000,
        мН: 0.001,
      },
      d: {
        м: 1,
        км: 1000,
        см: 0.01,
      },
    },
  },
  power: {
    id: "power",
    name: "Мощность",
    category: "Механика",
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
    units: {
      P: ["Вт", "кВт", "мВт"],
      A: ["Дж", "кДж", "мДж"],
      t: ["с", "мин", "ч"],
    },
    conversionFactors: {
      P: {
        Вт: 1,
        кВт: 1000,
        мВт: 0.001,
      },
      A: {
        Дж: 1,
        кДж: 1000,
        мДж: 0.001,
      },
      t: {
        с: 1,
        мин: 60,
        ч: 3600,
      },
    },
  },
  speed: {
    id: "speed",
    name: "Скорость",
    category: "Кинематика",
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
    units: {
      v: ["м/с", "км/ч", "миль/ч"],
      d: ["м", "км", "см"],
      t: ["с", "мин", "ч"],
    },
    conversionFactors: {
      v: {
        "м/с": 1,
        "км/ч": 0.277778,
        "миль/ч": 0.44704,
      },
      d: {
        м: 1,
        км: 1000,
        см: 0.01,
      },
      t: {
        с: 1,
        мин: 60,
        ч: 3600,
      },
    },
  },
  density: {
    id: "density",
    name: "Плотность",
    category: "Механика",
    variables: [
      { key: "rho", name: "Плотность", unit: "Кг/м³" },
      { key: "m", name: "Масса", unit: "Кг" },
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
    units: {
      rho: ["Кг/м³", "г/см³"],
      m: ["Кг", "тонны", "граммы", "мг"],
      V: ["м³", "л", "мл"],
    },
    conversionFactors: {
      rho: {
        "Кг/м³": 1,
        "г/см³": 1000,
      },
      m: {
        Кг: 1,
        тонны: 1000,
        граммы: 0.001,
        мг: 0.000001,
      },
      V: {
        "м³": 1,
        л: 0.001,
        мл: 0.000001,
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
  selectedUnits: Record<string, string>,
): number {
  const formula = getFormula(formulaId)
  if (!formula) throw new Error("Формула не найдена")

  const convertedValues: Partial<Record<string, number>> = { ...knownValues }

  for (const key in knownValues) {
    if (selectedUnits[key] && formula.conversionFactors?.[key]) {
      const baseUnit = formula.variables.find((v) => v.key === key)?.unit || ""
      convertedValues[key] = convertValue(
        knownValues[key]!,
        selectedUnits[key],
        baseUnit,
        key,
        formula.conversionFactors,
      )
    }
  }

  if (formula.constants) {
    for (const key in formula.constants) {
      convertedValues[key] = formula.constants[key].value
    }
  }

  if (targetVariable === formula.variables[0].key) {
    return formula.calculate(convertedValues)
  } else if (formula.reverse?.[targetVariable]) {
    return formula.reverse[targetVariable](convertedValues)
  }

  throw new Error(`Невозможно вычислить ${targetVariable}`)
}

export const convertValue = (
  value: number,
  fromUnit: string,
  toUnit: string,
  variableKey: string,
  conversionFactors: Record<string, Record<string, number>>,
): number => {
  const factorFrom = conversionFactors[variableKey][fromUnit]
  const factorTo = conversionFactors[variableKey][toUnit]
  return value * (factorFrom / factorTo)
}
