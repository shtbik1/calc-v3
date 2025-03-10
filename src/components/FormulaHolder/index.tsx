import FavoriteActiveIcon from "@/assets/icons/favorite_active_icon.svg"
import FavoriteIcon from "@/assets/icons/favorite_icon.svg"

export const FormulaHolder = ({
  disabled,
  isFavorite,
  formula,
  handleFormulaClick,
  handleFavoriteClick,
}: {
  disabled: boolean
  isFavorite: boolean
  formula: { name: string; link: string }
  handleFormulaClick: (
    event: React.MouseEvent<HTMLDivElement>,
    link: string,
  ) => void
  handleFavoriteClick: (
    event: React.MouseEvent<HTMLDivElement>,
    link: string,
  ) => void
}) => {
  return (
    <div
      onClick={(event) => {
        if (!disabled) handleFormulaClick(event, formula.link)
      }}
      className="flex h-14 w-[225px] relative bg-white hover:bg-gray-50 hover:border-gray-400 border rounded-xl p-4 justify-center items-center"
      key={formula.link}
    >
      <p>{formula.name}</p>
      <div
        onClick={(event) => {
          if (!disabled) handleFavoriteClick(event, formula.link)
        }}
        className="w-6 h-6 absolute right-1 top-1"
      >
        {isFavorite ? (
          <FavoriteActiveIcon />
        ) : (
          <FavoriteIcon style={{ fill: "#a3a3a3" }} />
        )}
      </div>
    </div>
  )
}
