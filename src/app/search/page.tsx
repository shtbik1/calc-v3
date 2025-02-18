"use client"

import { ChangeEvent, useState } from "react"

import { Input } from "@/components/ui/input"

const SearchPage = () => {
  const [searchValue, setSearchValue] = useState<string>("")

  const handleSearchValueChange = (event: ChangeEvent<HTMLInputElement>) => {
    console.log(event.target.value)
    setSearchValue(event.target.value)
  }
  return (
    <div>
      <Input value={searchValue} onChange={handleSearchValueChange} />
    </div>
  )
}

export default SearchPage
