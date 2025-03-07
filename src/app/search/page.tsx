"use client"

import { ChangeEvent, useEffect, useState } from "react"

import { useRouter } from "next/navigation"

import { FormulaHolder } from "@/components/FormulaHolder"
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
  const [filteredFormulas, setFilteredFormulas] = useState<
    Array<{ name: string; link: string }>
  >([])
  const [favoriteFormulas, setFavoriteFormulas] = useState<string[]>([]) // Массив для хранения избранных формул

  // Обработчик изменения поискового запроса
  const handleSearchValueChange = (event: ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value
    setSearchValue(value)

    const lowerCaseValue = value.toLowerCase()
    const filtered = formulas.filter((item) =>
      item.name.toLowerCase().includes(lowerCaseValue),
    )

    // Применяем сортировку с учетом избранных формул
    const sortedFiltered = sortFormulasWithFavorites(filtered, favoriteFormulas)
    setFilteredFormulas(sortedFiltered)
  }

  // Обработчик клика по формуле
  const handleFormulaClick = (
    event: React.MouseEvent<HTMLDivElement>,
    link: string,
  ) => {
    event?.stopPropagation()
    router.push(ROUTES.formulas.root + "/" + link)
  }

  // Обработчик добавления формулы в избранное
  const handleFavoriteClick = (
    event: React.MouseEvent<HTMLDivElement>,
    link: string,
  ) => {
    event.stopPropagation()
    setFavoriteFormulas((prev) => {
      // Если формула уже в избранном, удаляем её
      if (prev.includes(link)) {
        return prev.filter((item) => item !== link)
      }
      // Иначе добавляем в начало массива
      return [link, ...prev]
    })
  }

  // Функция для сортировки формул с учетом избранных
  const sortFormulasWithFavorites = (
    formulasTemp: Array<{ name: string; link: string }>,
    favorites: string[],
  ) => {
    const favoriteFormulasList = favorites
      .map((link) => formulasTemp.find((formula) => formula.link === link))
      .filter(Boolean) as Array<{ name: string; link: string }>

    const nonFavoriteFormulas = formulasTemp.filter(
      (formula) => !favorites.includes(formula.link),
    )

    return [...favoriteFormulasList, ...nonFavoriteFormulas]
  }

  // Загрузка формул при монтировании компонента
  useEffect(() => {
    ;(async () => {
      const res = await getFormulas()
      if (res.success) {
        setFormulas(res.result)
        setFilteredFormulas(
          sortFormulasWithFavorites(res.result, favoriteFormulas),
        )
      }
    })()
  }, [])

  // Сортировка формул при изменении избранного
  useEffect(() => {
    const sortedFormulas = sortFormulasWithFavorites(formulas, favoriteFormulas)
    setFilteredFormulas(sortedFormulas)
  }, [favoriteFormulas, formulas])

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
            <FormulaHolder
              key={formula.link}
              formula={formula}
              handleFormulaClick={handleFormulaClick}
              handleFavoriteClick={handleFavoriteClick}
              isFavorite={favoriteFormulas.includes(formula.link)} // Передаем состояние избранного
            />
          ))}
      </div>
    </div>
  )
}

export default SearchPage
