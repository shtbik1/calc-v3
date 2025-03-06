"use client"

import { ChangeEvent, useEffect, useState } from "react"

import { useRouter } from "next/navigation"

import { Input } from "@/components/ui/input"
import { Skeleton } from "@/components/ui/skeleton"
import { useGetFormulas } from "@/hooks/useGetFormulas"
import { ROUTES } from "@/utils/constants"

const SearchPage = () => {
  const router = useRouter()

  const { mutateAsync: getFormulas, isPending } = useGetFormulas()

  const [formulas, setFormulas] = useState<
    Array<{ name: string; link: string }>
  >([])
  const [searchValue, setSearchValue] = useState<string>("")
  const [filteredFormulas, setFilteredFormulas] =
    useState<Array<{ name: string; link: string }>>(formulas)

  const handleSearchValueChange = (event: ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value
    setSearchValue(value)

    const lowerCaseValue = value.toLowerCase()
    const filtered = formulas.filter((item) =>
      item.name.toLowerCase().includes(lowerCaseValue),
    )

    setFilteredFormulas(filtered)
  }

  const handleFormulaClick = (
    event: React.MouseEvent<HTMLDivElement>,
    link: string,
  ) => {
    event?.stopPropagation()
    router.push(ROUTES.formulas.root + "/" + link)
  }

  useEffect(() => {
    ;(async () => {
      const res = await getFormulas()
      if (res.success) {
        setFormulas(res.result)
        setFilteredFormulas(res.result)
      }
    })()
  }, [])

  return (
    <div className="w-full flex flex-col items-center gap-4 justify-center p-4">
      <div className="max-w-[475px] w-full flex flex-col gap-4">
        <p className="text-center">Калькулятор физических величин</p>
        <Input
          className="h-14 !outline-none !ring-0"
          value={searchValue}
          onChange={handleSearchValueChange}
          placeholder="Поиск формулы..."
        />
      </div>
      <div className="flex max-w-[707px] justify-center gap-4 flex-wrap">
        {isPending && (
          <>
            <Skeleton className="h-14 w-[150px]" />
            <Skeleton className="h-14 w-[150px]" />
            <Skeleton className="h-14 w-[150px]" />
          </>
        )}
        {!isPending &&
          filteredFormulas.length > 0 &&
          filteredFormulas.map((formula) => (
            <div
              onClick={(event) => handleFormulaClick(event, formula.link)}
              className="flex h-14 w-[225px] bg-white hover:bg-gray-50 hover:border-gray-400 border rounded-xl p-4 justify-center items-center"
              key={formula.link}
            >
              <p>{formula.name}</p>
            </div>
          ))}
      </div>
    </div>
  )
}

export default SearchPage
