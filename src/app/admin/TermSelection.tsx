'use client'
import DropDown from 'components/DropDown'

export default function TermDropDown({
  options,
  selected,
  setSelected,
}: {
  options: { id: number; label: string; value: string }[]
  selected: string
  setSelected: (value: string) => void
}) {
  return (
    <div>
      <DropDown
        label="Education Type"
        options={options}
        value={selected}
        handleChange={(e) => {
          if (typeof e === 'string') {
            setSelected(e)
          } else setSelected(e.target.value)
        }}
        name="term"
      />
    </div>
  )
}
