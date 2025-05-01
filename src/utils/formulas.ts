import { StaticImageData } from "next/image"

import densityImage from "@/assets/formulas/density.png"
import gravityImage from "@/assets/formulas/gravity.png"
import kineticEnergyImage from "@/assets/formulas/kinetic_energy.png"
import ohmsLawImage from "@/assets/formulas/ohms_law.png"
import potentialEnergyImage from "@/assets/formulas/potential_energy.png"
import powerImage from "@/assets/formulas/power.png"
import speedImage from "@/assets/formulas/speed.png"
import uniformMotionImage from "@/assets/formulas/uniform_motion.png"
import workImage from "@/assets/formulas/work.png"

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
  picture?: StaticImageData
  example?: {
    title: string
    description: string
    values: Record<string, number>
    targetVariable: string
    result: number
    solution: string
  }
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
    picture: gravityImage,
    example: {
      title: "Задача на силу тяжести",
      description: "Найдите силу тяжести, действующую на тело массой 5 кг.",
      values: {
        m: 5,
      },
      targetVariable: "F",
      result: 49.03325,
      solution:
        "1. Запишем формулу силы тяжести: \\(F = m \\cdot g\\)\n2. Подставим известные значения:\n\\(F = 5 \\cdot 9.80665\\)\n3. Выполним вычисления:\n\\(F = 49.03325\\) Н",
    },
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
    picture: kineticEnergyImage,
    example: {
      title: "Задача на кинетическую энергию",
      description:
        "Найдите кинетическую энергию тела массой 2 кг, движущегося со скоростью 3 м/с.",
      values: {
        m: 2,
        v: 3,
      },
      targetVariable: "E",
      result: 9,
      solution:
        "1. Запишем формулу кинетической энергии: \\(E = \\frac{1}{2} m v^2\\)\n2. Подставим известные значения:\n\\(E = \\frac{1}{2} \\cdot 2 \\cdot 3^2\\)\n3. Выполним вычисления:\n\\(E = \\frac{1}{2} \\cdot 2 \\cdot 9 = 9\\) Дж",
    },
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
    picture: potentialEnergyImage,
    example: {
      title: "Задача на потенциальную энергию",
      description:
        "Найдите потенциальную энергию тела массой 3 кг, поднятого на высоту 4 м.",
      values: {
        m: 3,
        h: 4,
      },
      targetVariable: "E",
      result: 117.6798,
      solution:
        "1. Запишем формулу потенциальной энергии: \\(E = m \\cdot g \\cdot h\\)\n2. Подставим известные значения:\n\\(E = 3 \\cdot 9.80665 \\cdot 4\\)\n3. Выполним вычисления:\n\\(E = 117.6798\\) Дж",
    },
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
    picture: ohmsLawImage,
    example: {
      title: "Задача на закон Ома",
      description:
        "Найдите напряжение на резисторе сопротивлением 10 Ом, если через него протекает ток 2 А.",
      values: {
        I: 2,
        R: 10,
      },
      targetVariable: "V",
      result: 20,
      solution:
        "1. Запишем формулу закона Ома: \\(V = I \\cdot R\\)\n2. Подставим известные значения:\n\\(V = 2 \\cdot 10\\)\n3. Выполним вычисления:\n\\(V = 20\\) В",
    },
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
      { key: "alpha", name: "Угол", unit: "градусы" },
    ],
    description: "Формула работы",
    formulaViewMathJax: "\\(A = F \\cdot d \\cdot \\cos(\\alpha)\\)",
    picture: workImage,
    example: {
      title: "Задача на работу силы",
      description:
        "Найдите работу силы 5 Н при перемещении тела на расстояние 3 м под углом 60° к направлению движения.",
      values: {
        F: 5,
        d: 3,
        alpha: 60,
      },
      targetVariable: "A",
      result: 7.5,
      solution:
        "1. Запишем формулу работы: \\(A = F \\cdot d \\cdot \\cos(\\alpha)\\)\n2. Подставим известные значения:\n\\(A = 5 \\cdot 3 \\cdot \\cos(60°)\\)\n3. Выполним вычисления:\n\\(A = 15 \\cdot 0.5 = 7.5\\) Дж",
    },
    calculate: ({ F, d, alpha }) => {
      if (F === undefined || d === undefined || alpha === undefined)
        throw new Error("Не хватает данных")
      // Конвертируем градусы в радианы
      const alphaRad = (alpha * Math.PI) / 180
      return F * d * Math.cos(alphaRad)
    },
    reverse: {
      F: ({ A, d, alpha }) => {
        if (A === undefined || d === undefined || alpha === undefined)
          throw new Error("Не хватает данных")
        const alphaRad = (alpha * Math.PI) / 180
        return A / (d * Math.cos(alphaRad))
      },
      d: ({ A, F, alpha }) => {
        if (A === undefined || F === undefined || alpha === undefined)
          throw new Error("Не хватает данных")
        const alphaRad = (alpha * Math.PI) / 180
        return A / (F * Math.cos(alphaRad))
      },
      alpha: ({ A, F, d }) => {
        if (A === undefined || F === undefined || d === undefined)
          throw new Error("Не хватает данных")
        // Конвертируем радианы обратно в градусы
        return (Math.acos(A / (F * d)) * 180) / Math.PI
      },
    },
    units: {
      A: ["Дж", "кДж", "мДж"],
      F: ["Н", "КН", "мН"],
      d: ["м", "км", "см"],
      alpha: ["градусы"],
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
    picture: powerImage,
    example: {
      title: "Задача на мощность",
      description:
        "Найдите мощность двигателя, если он совершает работу 1000 Дж за 5 секунд.",
      values: {
        A: 1000,
        t: 5,
      },
      targetVariable: "P",
      result: 200,
      solution:
        "1. Запишем формулу мощности: \\(P = \\frac{A}{t}\\)\n2. Подставим известные значения:\n\\(P = \\frac{1000}{5}\\)\n3. Выполним вычисления:\n\\(P = 200\\) Вт",
    },
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
    picture: speedImage,
    example: {
      title: "Задача на скорость",
      description:
        "Найдите скорость тела, если оно прошло расстояние 100 м за 20 секунд.",
      values: {
        d: 100,
        t: 20,
      },
      targetVariable: "v",
      result: 5,
      solution:
        "1. Запишем формулу скорости: \\(v = \\frac{d}{t}\\)\n2. Подставим известные значения:\n\\(v = \\frac{100}{20}\\)\n3. Выполним вычисления:\n\\(v = 5\\) м/с",
    },
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
    picture: densityImage,
    example: {
      title: "Задача на плотность",
      description:
        "Найдите плотность вещества массой 500 кг, занимающего объём 0.5 м³.",
      values: {
        m: 500,
        V: 0.5,
      },
      targetVariable: "rho",
      result: 1000,
      solution:
        "1. Запишем формулу плотности: \\(\\rho = \\frac{m}{V}\\)\n2. Подставим известные значения:\n\\(\\rho = \\frac{500}{0.5}\\)\n3. Выполним вычисления:\n\\(\\rho = 1000\\) Кг/м³",
    },
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
  uniform_motion: {
    id: "uniform_motion",
    name: "Равноускоренное движение",
    category: "Кинематика",
    variables: [
      { key: "S", name: "Путь", unit: "м" },
      { key: "v0", name: "Начальная скорость", unit: "м/с" },
      { key: "a", name: "Ускорение", unit: "м/с²" },
      { key: "t", name: "Время", unit: "с" },
    ],
    description: "Формула равноускоренного движения",
    formulaViewMathJax: "\\(S = v_0 t + \\frac{at^2}{2}\\)",
    picture: uniformMotionImage,
    example: {
      title: "Задача на равноускоренное движение",
      description:
        "Тело начинает движение с начальной скоростью 2 м/с и ускорением 3 м/с². Найдите путь, пройденный телом за 4 секунды.",
      values: {
        v0: 2,
        a: 3,
        t: 4,
      },
      targetVariable: "S",
      result: 32,
      solution:
        "1. Запишем формулу пути при равноускоренном движении: \\(S = v_0 t + \\frac{at^2}{2}\\)\n2. Подставим известные значения:\n\\(S = 2 \\cdot 4 + \\frac{3 \\cdot 4^2}{2}\\)\n3. Выполним вычисления:\n\\(S = 8 + 24 = 32\\) м",
    },
    calculate: ({ v0, t, a, S }) => {
      if (
        S === undefined &&
        v0 !== undefined &&
        t !== undefined &&
        a !== undefined
      ) {
        return v0 * t + (a * t * t) / 2
      } else if (
        v0 === undefined &&
        S !== undefined &&
        t !== undefined &&
        a !== undefined
      ) {
        return (S - (a * t * t) / 2) / t
      } else if (
        t === undefined &&
        S !== undefined &&
        v0 !== undefined &&
        a !== undefined
      ) {
        const discriminant = v0 * v0 + 2 * a * S
        if (discriminant < 0) throw new Error("Нет действительных решений")
        return (-v0 + Math.sqrt(discriminant)) / a
      } else if (
        a === undefined &&
        S !== undefined &&
        v0 !== undefined &&
        t !== undefined
      ) {
        return (2 * (S - v0 * t)) / (t * t)
      }
      throw new Error("Не хватает данных для вычисления")
    },
    reverse: {
      S: ({ v0, t, a }) => {
        if (v0 === undefined || t === undefined || a === undefined)
          throw new Error("Не хватает данных")
        return v0 * t + (a * t * t) / 2
      },
      v0: ({ S, t, a }) => {
        if (S === undefined || t === undefined || a === undefined)
          throw new Error("Не хватает данных")
        return (S - (a * t * t) / 2) / t
      },
      t: ({ S, v0, a }) => {
        if (S === undefined || v0 === undefined || a === undefined)
          throw new Error("Не хватает данных")
        const discriminant = v0 * v0 + 2 * a * S
        if (discriminant < 0) throw new Error("Нет действительных решений")
        return (-v0 + Math.sqrt(discriminant)) / a
      },
      a: ({ S, v0, t }) => {
        if (S === undefined || v0 === undefined || t === undefined)
          throw new Error("Не хватает данных")
        return (2 * (S - v0 * t)) / (t * t)
      },
    },
    units: {
      S: ["м", "км", "см"],
      v0: ["м/с", "км/ч", "миль/ч"],
      a: ["м/с²", "км/ч²"],
      t: ["с", "мин", "ч"],
    },
    conversionFactors: {
      S: {
        м: 1,
        км: 1000,
        см: 0.01,
      },
      v0: {
        "м/с": 1,
        "км/ч": 0.277778,
        "миль/ч": 0.44704,
      },
      a: {
        "м/с²": 1,
        "км/ч²": 0.0000771605,
      },
      t: {
        с: 1,
        мин: 60,
        ч: 3600,
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

  let result: number
  if (targetVariable === formula.variables[0].key) {
    result = formula.calculate(convertedValues)
  } else if (formula.reverse?.[targetVariable]) {
    result = formula.reverse[targetVariable](convertedValues)
  } else {
    throw new Error(`Невозможно вычислить ${targetVariable}`)
  }

  return Number(result.toFixed(4))
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
