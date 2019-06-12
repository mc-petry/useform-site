import { Button } from '@app/ui/button'
import { TextField } from '@app/ui/forms/text-field'
import { useForm } from '@mc-petry/useform'
import { useState } from 'react'
import { DemosResult } from '../_result'

interface Form {
  label: string
  msg: string
}

interface TransformableErrorRequired {
  id: 'required'
}

interface TransformableErrorMinLength {
  id: 'minlength'
  length: number
}

type TransformableError =
  TransformableErrorRequired |
  TransformableErrorMinLength

export function DemosTransformers() {
  const [result, setResult] = useState<Form>()
  const { fields, handleSubmit } = useForm<Form, TransformableError>(() => ({
    fields: {
      label: {
        validate: value => !value && { id: 'required' }
      },

      msg: {
        validate: value => (
          !value && { id: 'required' } ||
          value!.length < 10 && { id: 'minlength', length: 10 }
        )
      }
    },
    transformers: {
      label: field => {
        switch (field.name) {
          case 'label':
            return 'Label'

          case 'msg':
            return 'Message'
        }
      },

      error: (error, _field) => {
        switch (error.id) {
          case 'required':
            return `Required`

          case 'minlength':
            return `Minimum ${error.length} characters required`
        }
      }
    },
    submit: values => setResult(values)
  }))

  return <form onSubmit={handleSubmit}>
    <TextField
      field={fields.label}
    />
    <TextField
      field={fields.msg}
    />
    <Button type="submit">
      {'Submit'}
    </Button>
    <DemosResult result={result} />
  </form>
}
