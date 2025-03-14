"use client"

import { ChangeEvent, useEffect, useState } from "react"

import Cookies from "js-cookie"
import { useRouter } from "next/navigation"
import { useDispatch, useSelector } from "react-redux"
import { toast } from "react-toastify"

import { FilterGroup } from "@/components/FilterGroup"
import { FormulaHolder } from "@/components/FormulaHolder"
import { HistoryViewer } from "@/components/HistoryView"
import { Input } from "@/components/ui/input"
import { Skeleton } from "@/components/ui/skeleton"
import { useDeleteFavorite } from "@/hooks/favorite/useDeleteFavorite"
import { useGetFavorite } from "@/hooks/favorite/useGetFavorite"
import { useSendFavorite } from "@/hooks/favorite/useSendFavorite"
import { useGetFilters } from "@/hooks/filters/useGetFilters"
import { useGetFormulas } from "@/hooks/useGetFormulas"
import { RootState } from "@/store"
import { setAuthToken } from "@/store/slices/authSlice"
import { COOKIE_KEYS, ROUTES } from "@/utils/constants"

type FormulaProps = { name: string; link: string; category: string }

const SearchPage = () => {
  const router = useRouter()
  const dispatch = useDispatch()

  const { mutateAsync: getFormulas, isPending: getFormulasPending } =
    useGetFormulas()
  const { mutateAsync: sendFav, isPending: sendFavPending } = useSendFavorite()
  const { mutateAsync: getFav, isPending: getFavPending } = useGetFavorite()
  const { mutateAsync: deleteFav, isPending: deleteFavPending } =
    useDeleteFavorite()
  const { mutateAsync: getFilters, isPending: getFiltersPending } =
    useGetFilters()

  const authToken = useSelector((state: RootState) => state.authToken.authToken)

  const [formulas, setFormulas] = useState<Array<FormulaProps>>([])
  const [searchValue, setSearchValue] = useState<string>("")
  const [filteredFormulas, setFilteredFormulas] = useState<Array<FormulaProps>>(
    [],
  )
  const [favoriteFormulas, setFavoriteFormulas] = useState<string[]>([])
  const [filterGroup, setFilterGroup] = useState<Array<string>>([])
  const [savedFilterValue, setSavedFilterValue] = useState<{
    [key: number]: Array<string>
  }>({})

  const isPending = getFormulasPending || getFavPending

  const handleSearchValueChange = (event: ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value
    setSearchValue(value)

    const lowerCaseValue = value.toLowerCase()
    let filtered = formulas.filter((item) =>
      item.name.toLowerCase().includes(lowerCaseValue),
    )

    if (filterGroup.length > 0) {
      filtered = filtered.filter((formula) =>
        filterGroup.includes(formula.category),
      )
    }

    const sortedFiltered = sortFormulasWithFavorites(filtered, favoriteFormulas)
    setFilteredFormulas(sortedFiltered)
  }

  const handleFormulaClick = (
    event: React.MouseEvent<HTMLDivElement>,
    link: string,
  ) => {
    event?.stopPropagation()
    router.push(ROUTES.formulas.root + "/" + link)
  }

  const handleFavoriteClick = async (
    event: React.MouseEvent<HTMLDivElement>,
    link: string,
  ) => {
    event.stopPropagation()

    const isFavorite = favoriteFormulas.includes(link)

    if (isFavorite) {
      const res = await deleteFav({ formulaLink: link })
      if (res.success) {
        setFavoriteFormulas((prev) => prev.filter((item) => item !== link))
        toast.success("Формула удалена из избранного")
      }
      if (!res.success) {
        if (res.result.error === "unauthorized") {
          {
            toast.error("Необходимо авторизоваться")
            return
          }
        }
        toast.error("Произошла ошибка при удалении формулы")
      }
    }
    if (!isFavorite) {
      const res = await sendFav({ formulaLink: link })
      if (res.success) {
        setFavoriteFormulas((prev) => [link, ...prev])
        toast.success("Формула добавлена в избранное")
      }
      if (!res.success) {
        if (res.result.error === "unauthorized") {
          {
            toast.error("Необходимо авторизоваться")
            return
          }
        }
        toast.error("Произошла ошибка при добавлении формулы")
      }
    }
  }

  const sortFormulasWithFavorites = (
    formulasTemp: Array<FormulaProps>,
    favorites: string[],
  ) => {
    const favoriteFormulasList = favorites
      .map((link) => formulasTemp.find((formula) => formula.link === link))
      .filter(Boolean) as Array<FormulaProps>

    const nonFavoriteFormulas = formulasTemp.filter(
      (formula) => !favorites.includes(formula.link),
    )

    return [...favoriteFormulasList, ...nonFavoriteFormulas]
  }

  useEffect(() => {
    ;(async () => {
      const token = Cookies.get(COOKIE_KEYS.token)
      if (token) {
        dispatch(setAuthToken(token))
      }
      const res = await getFormulas()
      if (res.success) {
        setFormulas(res.result)
        setFilteredFormulas(
          sortFormulasWithFavorites(res.result, favoriteFormulas),
        )
      }
    })()
  }, [])

  useEffect(() => {
    let sortedFormulas = sortFormulasWithFavorites(formulas, favoriteFormulas)
    if (filterGroup.length > 0) {
      sortedFormulas = sortedFormulas.filter((formula) => {
        return filterGroup.includes(formula.category)
      })
    }

    setFilteredFormulas(sortedFormulas)
    sortedFormulas = []
  }, [filterGroup, favoriteFormulas, formulas])

  useEffect(() => {
    ;(async () => {
      if (authToken) {
        const res = await getFav()
        if (res.success) {
          const likedFormulas = Object.keys(
            res.result.existingData?.liked_formulas || {},
          )
          setFavoriteFormulas(likedFormulas)
        } else {
          setFavoriteFormulas([])
        }
      }
      if (authToken === null) {
        setFavoriteFormulas([])
      }
    })()
  }, [authToken])

  useEffect(() => {
    ;(async () => {
      if (authToken) {
        const res = await getFilters()
        if (res.success) {
          setSavedFilterValue(res.result.filters)
        } else {
          setSavedFilterValue([])
        }
      }
      if (authToken === null) {
        setSavedFilterValue([])
      }
    })()
  }, [authToken])

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
      <div>
        <FilterGroup
          values={filterGroup}
          setValue={setFilterGroup}
          savedFilterValue={savedFilterValue}
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
              disabled={isPending || sendFavPending}
              key={formula.link}
              formulaLink={formula.link}
              formulaName={formula.name}
              handleFormulaClick={(event) =>
                handleFormulaClick(event, formula.link)
              }
              handleFavoriteClick={(event) =>
                handleFavoriteClick(event, formula.link)
              }
              isFavorite={favoriteFormulas.includes(formula.link)}
            />
          ))}
      </div>
      <HistoryViewer />
    </div>
  )
}

export default SearchPage
