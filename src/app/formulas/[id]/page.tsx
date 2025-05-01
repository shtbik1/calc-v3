"use client"

import { use, useEffect, useState } from "react"

import { MathJax } from "better-react-mathjax"
import Image from "next/image"
import { useSelector } from "react-redux"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
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
import { useSendHistory } from "@/hooks/history/useSendHistory"
import { RootState } from "@/store"
import { getFormula, calculateVariable } from "@/utils/formulas"

const FormulaPage = (props: { params: Promise<{ id: string }> }) => {
  const params = use(props.params)
  const { id } = params

  const formula = getFormula(id)

  const authToken = useSelector((state: RootState) => state.authToken.authToken)

  const { mutateAsync: sendHistory, isPending: sendHistoryPending } =
    useSendHistory()

  const [values, setValues] = useState<Partial<Record<string, number>>>({})
  const [result, setResult] = useState<number | null>(null)
  const [targetVariable, setTargetVariable] = useState<string>("")
  const [displayFormula, setDisplayFormula] = useState(false)
  const [selectedUnits, setSelectedUnits] = useState<Record<string, string>>({})

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

  const targetVariableInfo = formula?.variables.find(
    (v) => v.key === targetVariable,
  )

  useEffect(() => {
    if (formula?.constants) {
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

  useEffect(() => {
    ;(async () => {
      if (authToken) {
        await sendHistory({
          formulaLink: formula?.id as string,
          formulaName: formula?.name as string,
        })
      }
    })()
  }, [authToken])

  if (!formula) return <div>Формула не найдена</div>

  return (
    <div className="max-w-[475px] w-full flex flex-col gap-4 p-4">
      <h1>{formula.name}</h1>
      <div className="flex gap-4">
        <p>{formula.description}</p>
        {!displayFormula && <Skeleton className="w-[200px] h-[24px]" />}
        {displayFormula && <MathJax>{formula.formulaViewMathJax}</MathJax>}
      </div>

      {formula.picture && (
        <div className="relative w-full h-[200px]">
          <Image
            src={formula.picture}
            alt={formula.name}
            fill
            className="object-contain"
          />
        </div>
      )}

      {formula.example && (
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="outline">Пример задачи</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{formula.example.title}</DialogTitle>
              <DialogDescription>
                {formula.example.description}
              </DialogDescription>
            </DialogHeader>
            <div className="flex flex-col gap-4">
              <div>
                <h3 className="font-semibold mb-2">Дано:</h3>
                {Object.entries(formula.example.values).map(([key, value]) => {
                  const variable = formula.variables.find((v) => v.key === key)
                  return (
                    <p key={key} className="flex gap-2 items-center">
                      <MathJax>{`\\(${key}\\)`}</MathJax> = {value}{" "}
                      {variable?.unit}
                    </p>
                  )
                })}
              </div>
              <div>
                <h3 className="font-semibold mb-2">Решение:</h3>
                <div className="whitespace-pre-line">
                  <MathJax>{formula.example.solution}</MathJax>
                </div>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Ответ:</h3>
                <p className="flex gap-2 items-center">
                  <MathJax>{`\\(${formula.example?.targetVariable}\\)`}</MathJax>{" "}
                  = {formula.example.result}{" "}
                  {
                    formula.variables.find(
                      (v) => v.key === formula.example?.targetVariable,
                    )?.unit
                  }
                </p>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}

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
          Результат: {targetVariableInfo.name} ={" "}
          {result.toString().replace(".", ",")} {targetVariableInfo.unit ?? ""}
        </p>
      )}
    </div>
  )
}

export default FormulaPage
