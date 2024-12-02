import { useState } from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import Label from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { generateKey } from '@/util'
import { X } from 'lucide-react'

type TagInputProps = {
  type: string
  preTag: string[]
  onAdd: (value: string[]) => void
  // eslint-disable-next-line react/require-default-props
  children?: React.ReactNode
}

export default function TagInputForm({
  type,
  preTag,
  onAdd,
  children,
}: TagInputProps) {
  const [inputValue, setInputValue] = useState('')
  const [tags, setTags] = useState<string[]>(preTag || [])

  const handleAddTag = () => {
    if (!inputValue.trim() || tags.length >= 10) return
    setTags((tag) => [...tag, inputValue])
    setInputValue('')
  }

  const handleDeleteTag = (tagIdx: number) => {
    setTags((prevTags) => prevTags.filter((_, index) => index !== tagIdx))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onAdd(tags)
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className="grid grid-cols-5 items-center gap-4">
        <Label htmlFor="enum" className="text-right">
          {type}
        </Label>
        <Input
          id={type}
          placeholder={`Write ${type}`}
          className="col-span-3"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
        />
        <Button type="button" variant="secondary" onClick={handleAddTag}>
          Add
        </Button>
      </div>
      {tags.length >= 10 && (
        <div className="mt-2 flex w-full justify-center">
          <span className="text-xs text-red-600">
            Up to 10 tags can be registered.{' '}
          </span>
        </div>
      )}
      <div className="sticky top-0 min-h-10 items-center gap-3 border-b p-2">
        {tags?.map((tag, idx) => (
          <Badge
            variant="default"
            className="mr-2 mt-2 cursor-pointer"
            key={generateKey(tag)}
          >
            {tag}
            <X className="ml-1 w-3" onClick={() => handleDeleteTag(idx)} />
          </Badge>
        ))}
      </div>
      {children}
    </form>
  )
}
