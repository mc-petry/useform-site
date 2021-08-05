import { Button } from '@app/ui/button'
import { TextField } from '@app/ui/forms/text-field'
import { css } from '@emotion/react'
import { useForm } from '@mc-petry/useform'
import { useCallback, useState } from 'react'
import { DemosResult } from './components/result'

const dynamicFieldName = 'dynamic'

export function DemosDynamic() {
  const [show, setShow] = useState(true)
  const { fields, handleSubmit, removeField, getValues } = useForm<{ name: string, [key: string]: string }>(() => ({
    fieldConfig: field => {
      if (field === dynamicFieldName) {
        return {
          validate: (value: string) => (
            !value && 'Required' ||
            value.length < 10 && 'Address length must be at least 10 symbols'
          )
        }
      }
    }
  }))

  const handleAddField = useCallback(() => setShow(true), [])
  const handleRemoveField = useCallback(() => {
    removeField(dynamicFieldName)
    setShow(false)
  }, [])

  return <form onSubmit={handleSubmit}>
    <TextField label={'Name'} field={fields.name} />
    {show
      ? <div css={styles.group}>
        <TextField
          label={'Dynamic'}
          field={fields[dynamicFieldName]}
        />
        <Button
          css={styles.remove}
          onClick={handleRemoveField}
          children={'Remove'}
        />
      </div>
      : <Button onClick={handleAddField}>{'Add dynamic'}</Button>
    }
    <DemosResult result={getValues()} />
  </form>
}

const styles = {
  group: css`
    display: flex;
  `,

  remove: css`
    margin: 22px 0 20px 20px;
  `
}
