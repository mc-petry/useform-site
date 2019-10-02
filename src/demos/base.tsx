import { Button } from '@app/ui/button'
import { NumberField } from '@app/ui/forms/number-field'
import { TextField } from '@app/ui/forms/text-field'
import { useForm } from '@mc-petry/useform'
import { useState } from 'react'
import { DemosResult } from './components/result'

interface User {
  name: string
  age: number
  email: string
}

export function DemosBase() {
  const [result, setResult] = useState<User>()
  const { fields, handleSubmit } = useForm<User>(() => ({
    fields: {
      name: {
        validate: value => (
          !value && 'Name is required' ||
          value!.length < 2 && 'Name too short'
        )
      },

      age: {
        validate: value => (
          value == null && 'Age is required' ||
          value! < 18 && 'You are too young'
        )
      }
    },
    submit: values => setResult(values)
  }))

  return <form onSubmit={handleSubmit}>
    <TextField
      field={fields.name}
      label={'Name'}
    />
    <NumberField
      field={fields.age}
      label={'Age'}
    />
    <TextField
      field={fields.email}
      label={'Email'}
    />
    <Button type="submit">
      {'Submit'}
    </Button>
    <DemosResult result={result} />
  </form>
}
