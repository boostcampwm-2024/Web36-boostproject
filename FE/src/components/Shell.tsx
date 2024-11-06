import * as React from 'react'
import PlayCircle from '@/assets/play_circle.svg'

export default function Shell() {
  return (
    <div className="flex h-12 w-full items-center overflow-hidden rounded-lg bg-secondary">
      <button type="button" className="bg-primary p-3">
        <img src={PlayCircle} alt="play button" />
      </button>
      <input
        type="text"
        className="ml-3 h-8 w-full border-none bg-secondary p-2 text-base font-medium text-foreground focus:outline-none"
      />
    </div>
  )
}
