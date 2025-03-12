import { Metadata } from "next"

import { useRestoreAdminData } from "@/hooks/useRestoreData"

export const metadata: Metadata = {
  title: "Search | Calc",
}

const SearchLayout = ({
  children,
}: Readonly<{ children: React.ReactNode }>) => {
  // const { restored } = useRestoreAdminData(["authToken"])
  // if (restored) {
  return children
  // }
  // return null
}

export default SearchLayout
