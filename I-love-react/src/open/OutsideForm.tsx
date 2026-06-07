import React from 'react'

const OutsideForm = ({formref, handleSubmit, value, setValue}:{formref: React.RefObject<HTMLFormElement | null>; handleSubmit: (e: React.FormEvent<HTMLFormElement>) => void; value: string; setValue: (value: string) => void}) => {
  return (
        <form ref={formref} id="submit-form" onSubmit={handleSubmit}>
        <input
          type="text"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          className="border border-gray-300 rounded px-4 py-2"
        />
      </form>
  )
}

export default OutsideForm