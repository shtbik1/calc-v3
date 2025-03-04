"use client"

import { ChangeEvent, useEffect, useState } from "react"

import { useRouter } from "next/navigation"

import { Input } from "@/components/ui/input"
import { Skeleton } from "@/components/ui/skeleton"
import { useGetFormulas } from "@/hooks/useGetFormulas"
import { ROUTES } from "@/utils/constants"
import { Formula } from "@/utils/formulas"

const SearchPage = () => {
  const router = useRouter()

  const { mutateAsync: getFormulas, isPending } = useGetFormulas()

  const [formulas, setFormulas] = useState<Record<string, Formula>>({})
  const [searchValue, setSearchValue] = useState<string>("")
  const [filteredFormulas, setFilteredFormulas] = useState<Array<Formula>>(
    Object.values(formulas),
  )

  const handleSearchValueChange = (event: ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value
    setSearchValue(value)

    const lowerCaseValue = value.toLowerCase()
    const filtered = Object.values(formulas).filter((item) =>
      item.name.toLowerCase().includes(lowerCaseValue),
    )

    setFilteredFormulas(filtered)
  }

  const handleFormulaClick = (
    event: React.MouseEvent<HTMLDivElement>,
    id: string,
  ) => {
    event?.stopPropagation()
    router.push(ROUTES.formulas.root + "/" + id)
  }

  useEffect(() => {
    ;(async () => {
      const res = await getFormulas()
      if (res.success) {
        setFormulas(res.result.formulas)
        setFilteredFormulas(Object.values(res.result.formulas))
      }
    })()
  }, [])

  return (
    <div className="w-full flex justify-center p-4">
      <div className="max-w-[475px] w-full flex flex-col gap-4">
        <p className="text-center">Калькулятор физических величин</p>
        <Input
          className="h-14 !outline-none !ring-0"
          value={searchValue}
          onChange={handleSearchValueChange}
          placeholder="Поиск формулы..."
        />

        <div className="flex gap-4 flex-wrap">
          {isPending && <Skeleton className="h-14 w-[150px]" />}
          {!isPending &&
            filteredFormulas.length > 0 &&
            filteredFormulas.map((formula) => (
              <div
                onClick={(event) => handleFormulaClick(event, formula.id)}
                className="flex h-14 w-fit bg-white hover:bg-gray-50 hover:border-gray-400 border rounded-xl p-4 justify-center items-center"
                key={formula.id}
              >
                <p>{formula.name}</p>
              </div>
            ))}
        </div>
      </div>
    </div>
  )
}

export default SearchPage
