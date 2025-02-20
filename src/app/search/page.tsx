"use client"

import { ChangeEvent, useState } from "react"

import { useRouter } from "next/navigation"

import { Input } from "@/components/ui/input"
import { ROUTES } from "@/utils/constants"
import { Formula, formulas } from "@/utils/formulas"

const SearchPage = () => {
  const router = useRouter()
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

  return (
    <div>
      <Input
        value={searchValue}
        onChange={handleSearchValueChange}
        placeholder="Поиск формулы..."
      />

      {filteredFormulas.length > 0 ? (
        filteredFormulas.map((formula) => (
          <div
            onClick={(event) => handleFormulaClick(event, formula.id)}
            className="flex h-14 w-fit border rounded-xl p-4 justify-center items-center"
            key={formula.id}
          >
            <p>{formula.name}</p>
          </div>
        ))
      ) : (
        <p>Ничего не найдено</p>
      )}
    </div>
  )
}

export default SearchPage
