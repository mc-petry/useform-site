import { Button } from '@app/ui/button'
import { TextField } from '@app/ui/forms/text-field'
import { css } from '@emotion/react'
import { addFieldItem, Field, PrimitiveFormFields, removeFieldItem, useChildForm, useForm } from '@mc-petry/useform'
import { useCallback } from 'react'
import { DemosResult } from './components/result'

interface FormData {
  names: string[]
}

export function DemosArrayPrimitive() {
  const { fields, handleSubmit, getValues } = useForm<FormData>(() => ({
    initialValues: {
      names: [
        'John',
        ''
      ]
    },
    submit: () => alert('Submission successful')
  }))

  const handleAdd = useCallback(() => {
    addFieldItem(fields.names, '')
  }, [])

  return <form onSubmit={handleSubmit}>
    {fields.names.value!.map((_, i) => {
      return <div key={i} css={styles.item}>
        <NamesForm
          index={i}
          field={fields.names}
        />
        <Button
          css={styles.btnRemove}
          onClick={() => removeFieldItem(fields.names, i)}
          children={'X'}
        />
      </div>
    })}

    <div css={styles.actions}>
      <Button onClick={handleAdd}>
        {'Add field'}
      </Button>

      <Button type="submit">{'Submit'}</Button>
    </div>

    <DemosResult result={getValues()} />
  </form>
}

function NamesForm({ field, index }: { field: Field<string[]>, index: number }) {
  const child = useForm<PrimitiveFormFields<string>>(() => ({
    fields: {
      index: {
        validate: v => !v && 'required'
      }
    }
  }))

  const { fields } = useChildForm(index, field, child)

  return <TextField field={fields.index} />
}

const styles = {
  item: css`
    display: flex;
  `,

  btnRemove: css`
    margin-left: 20px;
  `,

  actions: css`
    margin-bottom: 20px;

    > button:not(:last-of-type) {
      margin-right: 20px;
    }
  `
}
