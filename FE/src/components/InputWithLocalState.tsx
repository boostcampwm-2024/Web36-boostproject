import { useState } from 'react'
import { Input } from '@/components/ui/input'

type InputWithLocalStateProps<T> =
  React.InputHTMLAttributes<HTMLInputElement> & {
    value: T
    onChange: (value: T) => void
  }

export default function InputWithLocalState<T>({
  value,
  onChange,
  ...props
}: InputWithLocalStateProps<T>) {
  const [localValue, setLocalValue] = useState<T>(value)

  const handleBlur = () => {
    onChange(localValue)
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value
    setLocalValue(inputValue as T)
  }

  return (
    <Input
      // eslint-disable-next-line react/jsx-props-no-spreading
      {...props}
      value={localValue as string}
      onChange={handleChange}
      onBlur={handleBlur}
    />
  )
}
