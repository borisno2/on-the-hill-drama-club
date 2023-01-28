"use client"
import { Button } from "components/Button";
import DropDown from "components/DropDown";
import { useState } from "react";

export default function TermDropDown({ options }: { options: { id: number; label: string; value: string }[] }) {
  const [selected, setSelected] = useState(options[0].value)
  const [loading, setLoading] = useState(false)
  const [returned, setReturned] = useState<{ accountId: string, qboId: number }>()
  return (
    <div>
      <DropDown
        label="Education Type"
        options={options}
        value={selected}
        handleChange={
          (e) => {
            if (typeof e === 'string') {
              setSelected(e)
            } else
              setSelected(e.target.value)
          }
        }
        name="term"
      />
      <Button onClick={
        async () => {
          setLoading(true)
          console.log(selected)
          await fetch('/api/intuit/generate-invoices', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({ termId: selected })
          }).then(async (res) => {
            if (res.ok && res.body) {
              const items = await res.json()
              setReturned(items)

            } else {
              console.log('error')
            }
          }).catch((err) => {
            console.log(err)
          })
          setLoading(false)
        }
      }>
        Generate Invoices
      </Button>
      {loading && <div>loading</div>}
      {returned && <div>{JSON.stringify(returned)}</div>}
    </div>
  );
}