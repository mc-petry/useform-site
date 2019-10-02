import { Button } from '@app/ui/button'
import { TextField } from '@app/ui/forms/text-field'
import { useForm } from '@mc-petry/useform'
import { useState } from 'react'
import { DemosResult } from './components/result'

interface Form {
  pass: string
  pass2: string
}

export function DemosDependent() {
  const [result, setResult] = useState<Form>()
  const { fields, handleSubmit } = useForm<Form>(() => ({
    fields: {
      pass: {
        validate: value => (
          !value && 'Password is required'
        ),
        dependent: 'pass2'
      },

      pass2: {
        validate: (value, { pass }) => (
          value !== pass.value && 'Passwords do not match'
        )
      }
    },
    submit: values => setResult(values)
  }))

  return <form onSubmit={handleSubmit}>
    <TextField
      field={fields.pass}
      label={'Password'}
    />
    <TextField
      field={fields.pass2}
      label={'Repeat password'}
    />
    <Button type="submit">
      {'Submit'}
    </Button>
    <DemosResult result={result} />
  </form>
}
