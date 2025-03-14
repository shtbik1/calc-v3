import React, { Dispatch, SetStateAction, useState } from "react"

import { toast } from "react-toastify"

import TrashIcon from "@/assets/icons/trash_icon.svg"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import { useDeleteFilters } from "@/hooks/filters/useDeleteFilters"
import { useSendFilters } from "@/hooks/filters/useSendFilters"

import { Button } from "../ui/button"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "../ui/select"

export const FilterGroup = ({
  values,
  savedFilterValue,
  setValue,
}: {
  values: Array<string>
  savedFilterValue: { [key: number]: string[] }
  setValue: Dispatch<SetStateAction<Array<string>>>
}) => {
  const { mutateAsync: deleteFilter, isPending: deletePending } =
    useDeleteFilters()
  const { mutateAsync: sendFilter, isPending: sendPending } = useSendFilters()
  const [targetVariable, setTargetVariable] = useState<string>("")

  const disabled = deletePending || sendPending

  const handleSaveClick = async () => {
    const res = await sendFilter({ filters: values })
    if (res.success) {
      toast.success("Фильтр успешно добавлен")
    }
    if (!res.success) {
      toast.error("При добавлении фильтра произошла ошибка")
    }
  }

  const handleDeleteClick = async (
    event: React.MouseEvent<HTMLDivElement>,
    key: string,
  ) => {
    if (disabled) {
      return
    }
    event.stopPropagation()
    const res = await deleteFilter({
      filters: { [key]: savedFilterValue[Number(key)] },
    })
    if (res.success) {
      toast.success("Фильтр удален")
      setTargetVariable("")
      setValue([])
      delete savedFilterValue[Number(key)]
    }
    if (!res.success) {
      toast.error("ошибка при удаление фильтра")
    }
  }

  const handleGroupChange = (value: Array<string>) => {
    setValue(value)
    setTargetVariable("")
  }

  const handleSelectChange = (value: string) => {
    if (value === "clear") {
      setTargetVariable("")
      setValue([])
      return
    }
    setTargetVariable(value)
    setValue(savedFilterValue[Number(value)])
  }

  return (
    <div className="flex flex-col gap-2">
      <div className="flex flex-col gap-2 items-center">
        {(!values.length || targetVariable) && <div className="h-10" />}
        {!!values.length && !targetVariable && (
          <Button className="w-fit" onClick={handleSaveClick}>
            Сохранить параметры фильтрации
          </Button>
        )}
        {!!Object.keys(savedFilterValue).length && (
          <div className="flex gap-4 items-center">
            <Select
              disabled={disabled}
              value={targetVariable}
              onValueChange={handleSelectChange}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Сохраненная фильтрация" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Фильтры</SelectLabel>
                  {targetVariable && (
                    <SelectItem value="clear">Очистить</SelectItem>
                  )}
                  {Object.keys(savedFilterValue).map((key) => (
                    <SelectItem key={key} value={key.toString()}>
                      <div className="flex !w-full items-center">
                        <p className="w-[296px] text-left">
                          {savedFilterValue[Number(key)].join(", ")}{" "}
                        </p>
                      </div>
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
            {targetVariable && (
              <div
                className="w-6 h-6 cursor-pointer"
                onClick={(event) => handleDeleteClick(event, targetVariable)}
              >
                <TrashIcon />
              </div>
            )}
          </div>
        )}
      </div>

      <ToggleGroup
        disabled={disabled}
        value={values}
        onValueChange={handleGroupChange}
        type="multiple"
      >
        <ToggleGroupItem
          className="rounded-[20px] border h-[32px] bg-white text-[15px]"
          value="Механика"
        >
          <p className="">Механика</p>
        </ToggleGroupItem>
        <ToggleGroupItem
          className="rounded-[20px] border h-[32px] bg-white text-[15px]"
          value="Электродинамика"
        >
          <p className="">Электродинамика</p>
        </ToggleGroupItem>
        <ToggleGroupItem
          className="rounded-[20px] border h-[32px] bg-white text-[15px]"
          value="Кинематика"
        >
          <p className="">Кинематика</p>
        </ToggleGroupItem>
      </ToggleGroup>
    </div>
  )
}
