"use client"

import { use, useState } from "react"

import { useRouter } from "next/navigation"

import { getFormula, calculateVariable } from "@/utils/formulas"

const FormulaPage = (props: { params: Promise<{ id: string }> }) => {
  const params = use(props.params)
  const { id } = params

  const formula = getFormula(id)
  const router = useRouter()

  const [values, setValues] = useState<Partial<Record<string, number>>>({})
  const [result, setResult] = useState<number | null>(null)
  const [targetVariable, setTargetVariable] = useState<string>("")

  if (!formula) return <div>Формула не найдена</div>

  const handleInputChange = (key: string, value: string) => {
    setValues((prev) => ({ ...prev, [key]: value ? Number(value) : undefined }))
  }

  const handleCalculate = () => {
    if (!targetVariable) {
      setResult(null)
      return
    }

    try {
      setResult(calculateVariable(formula.id, values, targetVariable))
    } catch (error) {
      console.log(error)
      setResult(null)
    }
  }

  return (
    <div>
      <h1>{formula.name}</h1>
      <p>{formula.description}</p>

      <label>Выберите переменную для вычисления:</label>
      <select
        onChange={(e) => setTargetVariable(e.target.value)}
        value={targetVariable}
      >
        <option value="">Выбрать</option>
        {formula.variables.map((variable) => (
          <option key={variable.key} value={variable.key}>
            {variable.name}
          </option>
        ))}
      </select>

      {formula.variables.map((variable) => (
        <div key={variable.key}>
          <label>{variable.name}</label>
          <input
            type="number"
            disabled={variable.key === targetVariable}
            onChange={(e) => handleInputChange(variable.key, e.target.value)}
          />
        </div>
      ))}

      <button onClick={handleCalculate} disabled={!targetVariable}>
        Рассчитать
      </button>

      {result !== null && <p>Результат: {result}</p>}

      <button onClick={() => router.push("/")}>Назад</button>
    </div>
  )
}

export default FormulaPage
