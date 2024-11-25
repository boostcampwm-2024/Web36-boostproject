import { Input } from '@/components/ui/input'
import { useState } from 'react'

type EditableInputProps = {
  value: string
  rowIdx: number
  handleOnChange: (row: number, id: string, value: unknown) => void
}

export default function EditableInput({
  value,
  rowIdx,
  handleOnChange,
}: EditableInputProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [inputValue, setInputValue] = useState(value)

  return (
    <div>
      {isEditing ? (
        <Input
          type="text"
          value={inputValue}
          className="h-[32px] w-[70px] p-2"
          onChange={(e) => setInputValue(e.target.value)}
          onBlur={() => {
            setIsEditing(false)
            handleOnChange(rowIdx, 'name', inputValue)
          }}
        />
      ) : (
        <span onDoubleClick={() => setIsEditing(true)}>{value}</span>
      )}
    </div>
  )
}
