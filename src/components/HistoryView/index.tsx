"use client"

import React, { useEffect, useState } from "react"

import { useRouter } from "next/navigation"
import { useDispatch, useSelector } from "react-redux"

import { useGetHistory } from "@/hooks/history/useGetHistory"
import { RootState } from "@/store"
import { setClearHistoryAction } from "@/store/slices/actionsSlice"
import { ROUTES } from "@/utils/constants"

import { FormulaHolder } from "../FormulaHolder"

export const HistoryViewer = () => {
  const router = useRouter()
  const dispatch = useDispatch()
  const { mutateAsync: getHistory, isPending } = useGetHistory()

  const authToken = useSelector((state: RootState) => state.authToken.authToken)
  const clearHistoryAction = useSelector(
    (state: RootState) => state.actionsState.clearHistory,
  )

  const [sortedData, setSortedData] = useState<
    Array<{ addedAt: string; formulaName: string; link: string }>
  >([])

  const handleFormulaClick = (
    event: React.MouseEvent<HTMLDivElement>,
    link: string,
  ) => {
    event?.stopPropagation()
    router.push(ROUTES.formulas.root + "/" + link)
  }

  useEffect(() => {
    ;(async () => {
      if (authToken) {
        const res = await getHistory()
        if (res.success) {
          setSortedData(
            Object.entries(res.result.history)
              .sort(
                (a, b) =>
                  new Date(b[1].addedAt).getTime() -
                  new Date(a[1].addedAt).getTime(),
              )
              .map(([link, value]) => ({
                link,
                addedAt: value.addedAt,
                formulaName: value.formulaName,
              })),
          )
        }
      }
      if (authToken === null) {
        setSortedData([])
      }
    })()
  }, [authToken])

  useEffect(() => {
    if (clearHistoryAction) {
      setSortedData([])
      dispatch(setClearHistoryAction(false))
    }
  }, [clearHistoryAction])

  if (!!sortedData.length) {
    return (
      <div className="flex gap-2 flex-col items-center">
        <h2>Недавно посещенные</h2>
        <div className="flex max-w-[707px] justify-center gap-4 flex-wrap">
          {sortedData.map((item) => (
            <FormulaHolder
              key={item.link}
              formulaLink={item.link}
              formulaName={item.formulaName}
              disabled={false}
              hideFavorite
              isFavorite={false}
              handleFormulaClick={(event) =>
                handleFormulaClick(event, item.link)
              }
              handleFavoriteClick={(event, link) => {
                console.log("Favorite clicked:", link)
              }}
            />
          ))}
        </div>
      </div>
    )
  }
  return null
}
