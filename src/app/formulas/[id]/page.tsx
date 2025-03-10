"use client"

import { use, useEffect, useState } from "react"

import { MathJax } from "better-react-mathjax"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Skeleton } from "@/components/ui/skeleton"
import { getFormula, calculateVariable } from "@/utils/formulas"

const FormulaPage = (props: { params: Promise<{ id: string }> }) => {
  const params = use(props.params)
  const { id } = params

  const formula = getFormula(id)

  const [values, setValues] = useState<Partial<Record<string, number>>>({})
  const [result, setResult] = useState<number | null>(null)
  const [targetVariable, setTargetVariable] = useState<string>("")
  const [displayFormula, setDisplayFormula] = useState(false)
  const [selectedUnits, setSelectedUnits] = useState<Record<string, string>>({})

  useEffect(() => {
    if (formula?.constants) {
      // Записываем константы в values при загрузке
      setValues((prev) => ({
        ...prev,
        ...Object.fromEntries(
          Object.entries(formula.constants ?? {}).map(([key, { value }]) => [
            key,
            value,
          ]),
        ),
      }))
    }

    setTimeout(() => {
      setDisplayFormula(true)
    }, 500)
  }, [formula])

  const handleInputChange = (key: string, value: string) => {
    setValues((prev) => ({
      ...prev,
      [key]: value ? Number(value) : undefined,
    }))
  }

  const handleUnitChange = (key: string, unit: string) => {
    setSelectedUnits((prev) => ({
      ...prev,
      [key]: unit,
    }))
  }

  const handleCalculate = () => {
    if (!targetVariable) {
      setResult(null)
      return
    }

    try {
      if (formula) {
        const res = calculateVariable(
          formula.id,
          values,
          targetVariable,
          selectedUnits,
        )
        setResult(res)
      }
    } catch (error) {
      setResult(null)
    }
  }

  const handleTargetVariableChange = (value: string) => {
    setTargetVariable(value)

    setValues((prev) => {
      const newValues = { ...prev }

      const keys = Object.keys(newValues)
      if (!formula?.constants) {
        return {}
      }
      keys.map((key) => {
        if (
          key in newValues &&
          formula.constants &&
          !(key in formula.constants)
        )
          delete newValues[key]
      })

      return newValues
    })
  }

  if (!formula) return <div>Формула не найдена</div>

  const targetVariableInfo = formula.variables.find(
    (v) => v.key === targetVariable,
  )

  return (
    <div className="max-w-[475px] w-full flex flex-col gap-4 p-4">
      <h1>{formula.name}</h1>
      <div className="flex gap-4">
        <p>{formula.description}</p>
        {!displayFormula && <Skeleton className="w-[200px] h-[24px]" />}
        {displayFormula && <MathJax>{formula.formulaViewMathJax}</MathJax>}
      </div>

      <label>Выберите переменную, которую хотите найти:</label>
      <Select value={targetVariable} onValueChange={handleTargetVariableChange}>
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Выберите переменную" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectLabel>Переменная</SelectLabel>
            {formula.variables.map((variable) => (
              <SelectItem key={variable.key} value={variable.key}>
                {variable.name}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>

      {formula.variables.map((variable) => (
        <div key={variable.key}>
          <label className="flex gap-2">
            {displayFormula && <MathJax>{`\\(${variable.key}\\)`}</MathJax>}
            {!displayFormula && (
              <Skeleton className="h-[21px] w-[21px] !rounded-md" />
            )}{" "}
            - {variable.name}
          </label>
          <div className="flex gap-2">
            <Input
              type="number"
              disabled={variable.key === targetVariable || !targetVariable}
              value={values[variable.key] ?? ""}
              onChange={(e) => handleInputChange(variable.key, e.target.value)}
            />
            <Select
              disabled={variable.key === targetVariable || !targetVariable}
              value={selectedUnits[variable.key] || variable.unit}
              onValueChange={(value) => handleUnitChange(variable.key, value)}
            >
              <SelectTrigger className="w-[100px]">
                <SelectValue placeholder="Единица" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Единица</SelectLabel>
                  {formula.units?.[variable.key]?.map((unit) => (
                    <SelectItem key={unit} value={unit}>
                      {unit}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
        </div>
      ))}

      {formula.constants &&
        Object.entries(formula.constants).map(([key, constant]) => (
          <div key={key}>
            <label className="flex gap-2">
              {displayFormula && <MathJax>{`\\(${key}\\)`}</MathJax>}
              {!displayFormula && (
                <Skeleton className="h-[21px] w-[21px] !rounded-md" />
              )}{" "}
              - {constant.name}
            </label>
            <Input type="number" value={constant.value} disabled />
          </div>
        ))}

      <Button onClick={handleCalculate} disabled={!targetVariable}>
        Рассчитать
      </Button>

      {result !== null && targetVariableInfo && (
        <p>
          Результат: {targetVariableInfo.name} = {result}{" "}
          {targetVariableInfo.unit ?? ""}
        </p>
      )}
    </div>
  )
}

export default FormulaPage
