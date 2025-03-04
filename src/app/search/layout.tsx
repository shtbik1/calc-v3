import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Search | Calc",
}

const SearchLayout = ({
  children,
}: Readonly<{ children: React.ReactNode }>) => {
  return children
}

export default SearchLayout
