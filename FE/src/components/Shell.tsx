import * as React from 'react'
import PlayCircle from '@/assets/play_circle.svg'

export default function Shell() {
  return (
    <>
      <div className="flex h-12 w-full items-center overflow-hidden rounded-sm bg-secondary">
        <button type="button" className="bg-primary p-3">
          <img src={PlayCircle} alt="play button" />
        </button>
        <input
          type="text"
          className="ml-3 h-8 w-full border-none bg-secondary p-2 text-base font-medium text-foreground focus:outline-none"
        />
      </div>
      <div className="flex w-full flex-col overflow-hidden rounded-sm bg-secondary">
        <div className="m-3">
          <p>this is result</p>
        </div>
        <button type="button" className="flex w-full justify-center bg-primary">
          <div className="text-bold w-3 text-background">+</div>
        </button>
      </div>
    </>
  )
}
