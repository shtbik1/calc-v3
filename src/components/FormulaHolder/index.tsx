import FavoriteActiveIcon from "@/assets/icons/favorite_active_icon.svg"
import FavoriteIcon from "@/assets/icons/favorite_icon.svg"

export const FormulaHolder = ({
  disabled,
  hideFavorite,
  isFavorite,
  formulaLink,
  formulaName,
  handleFormulaClick,
  handleFavoriteClick,
}: {
  disabled: boolean
  hideFavorite?: boolean
  isFavorite: boolean
  formulaLink: string
  formulaName: string
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
        if (!disabled) handleFormulaClick(event, formulaLink)
      }}
      className="flex h-14 w-[225px] relative bg-white hover:bg-gray-50 hover:border-gray-400 border rounded-xl p-4 justify-center items-center"
      key={formulaLink}
    >
      <p>{formulaName}</p>
      {!hideFavorite && (
        <div
          onClick={(event) => {
            if (!disabled) handleFavoriteClick(event, formulaLink)
          }}
          className="w-6 h-6 absolute right-1 top-1"
        >
          {isFavorite ? (
            <FavoriteActiveIcon />
          ) : (
            <FavoriteIcon style={{ fill: "#a3a3a3" }} />
          )}
        </div>
      )}
    </div>
  )
}
