'use client'

import { Button } from 'components/Button'
import { useState } from 'react'
import TermSelection from '../TermSelection'
import { Formik } from 'formik'

export default function GenerateInvoiceButton({
  options,
}: {
  options: { id: number; label: string; value: string }[]
}) {
  const [selected, setSelected] = useState(options[0].value)

  const [loading, setLoading] = useState(false)
  const [returned, setReturned] = useState<{
    accountId: string
    qboId: number
  }>()

  const initialValues = {
    term: '',
    startDate: '',
    endDate: '',
  }
  return (
    <>
      <Formik initialValues={{ term: '' }} onSubmit={async (values) => {}}>
        {({ values, handleChange, handleSubmit }) => (
          <form onSubmit={handleSubmit}>
            <TermSelection
              options={options}
              selected={values.term}
              setSelected={setSelected}
            />
          </form>
        )}
      </Formik>

      <Button
        onClick={async () => {
          setLoading(true)
          console.log(selected)
          await fetch('/api/intuit/generate-invoices', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ termId: selected }),
          })
            .then(async (res) => {
              if (res.ok && res.body) {
                const items = await res.json()
                setReturned(items)
              } else {
                console.log('error')
              }
            })
            .catch((err) => {
              console.log(err)
            })
          setLoading(false)
        }}
      >
        Generate Invoices
      </Button>
      {loading && <div>loading</div>}
      {returned && <div>{JSON.stringify(returned)}</div>}
    </>
  )
}
