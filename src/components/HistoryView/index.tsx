"use client"

import React, { useEffect, useState } from "react"

import { FormulaHolder } from "../FormulaHolder"
import { useGetHistory } from "@/hooks/useGetHistory"

interface HistoryData {
  [formulaName: string]: {
    addedAt: string
    formulaName: string
  }
}

export const HistoryViewer = () => {
  const { mutateAsync: getHistory, isPending } = useGetHistory()
  const [history, setHistory] = useState<HistoryData>({})

  useEffect(() => {
    ;(async () => {
      const res = await getHistory()
      if (res.success) {
        setHistory(res.result.history)
      }
    })()
  }, [getHistory])

  const getSortedFormulas = () => {
    return Object.entries(history).sort((a, b) => {
      return new Date(b[1].addedAt).getTime() - new Date(a[1].addedAt).getTime()
    })
  }

  return (
    <div className="flex gap-4 flex-col items-center">
      <h2>Недавно посещенные</h2>
      <div className="flex max-w-[707px] justify-center gap-4 flex-wrap">
        {getSortedFormulas().map(([formulaLink, formulaData]) => (
          <FormulaHolder
            key={formulaLink}
            formulaLink={formulaLink}
            formulaName={formulaData.formulaName}
            disabled={false}
            hideFavorite
            isFavorite={false}
            handleFormulaClick={(event, link) => {
              console.log("Formula clicked:", link)
            }}
            handleFavoriteClick={(event, link) => {
              console.log("Favorite clicked:", link)
            }}
          />
        ))}
      </div>
    </div>
  )
}
