import { Button } from '@app/ui/button'
import { TextField } from '@app/ui/forms/text-field'
import { css } from '@emotion/react'
import { addFieldItem, Field, removeFieldItem, useChildForm, useForm } from '@mc-petry/useform'
import { useCallback } from 'react'
import { DemosResult } from './components/result'

interface UserData {
  name: string
  country: string
}

interface FormData {
  users: UserData[]
}

export function DemosArrayObject() {
  const { fields, handleSubmit, getValues } = useForm<FormData>(() => ({
    initialValues: {
      users: [
        { name: 'Bart', country: 'Ukraine' }
      ]
    },
    submit: () => {
      alert('Submission successful')
    }
  }))

  const handleAdd = useCallback(() => {
    addFieldItem(fields.users, { name: '', country: '' })
  }, [])

  return <form onSubmit={handleSubmit}>
    {fields.users.value!.map((_, i) =>
      <UsersForm
        key={i}
        index={i}
        field={fields.users}
      />
    )}

    <div css={styles.actions}>
      <Button onClick={handleAdd}>{'Add'}</Button>
      <Button type="submit">{'Submit'}</Button>
    </div>

    <DemosResult result={getValues()} />
  </form>
}

function UsersForm({ field, index }: { field: Field<UserData[]>, index: number }) {
  const child = useForm<UserData>(() => ({
    fields: {
      name: {
        validate: v => !v && 'required'
      },
      country: {
        validate: v => !v && 'required'
      }
    }
  }), [])

  const { fields } = useChildForm(index, field, child)

  return <div css={styles.block}>
    <div css={styles.blockInfo}>{'Info'}</div>
    <div
      css={styles.btnRemove}
      onClick={() => removeFieldItem(field, index)}
    />
    <TextField
      field={fields.name}
      label={'Name'}
    />
    <TextField
      field={fields.country}
      label={'City'}
    />
  </div>
}

const styles = {
  item: css`
    display: flex;
  `,

  actions: css`
    margin-bottom: 20px;

    > button:not(:last-of-type) {
      margin-right: 20px;
    }
  `,

  block: css`
    border: 1px solid #dddee4;
    border-radius: 3px;
    margin: 20px 0;
    padding: 20px 20px 0;
    position: relative;
  `,

  blockInfo: css`
    position: absolute;
    background: #f9fbfc;
    padding: 0 12px;
    margin: -30px 0 0;
    font-size: 16px;
    color: #666;
  `,

  btnRemove: css`
    top: -10px;
    right: 20px;
    position: absolute;
    cursor: pointer;
    width: 40px;
    height: 16px;
    background: #f9fbfc;

    ::before,
    ::after {
      content: "";
      display: block;
      position: absolute;
      border-bottom: 1px solid rgba(0,0,0,.3);
      width: 16px;
      top: 50%;
      left: 12px;
    }

    ::before {
      transform: rotate(-45deg);
    }

    ::after {
      transform: rotate(45deg);
    }

    :hover {
      ::before,
      ::after {
        border-color: rgba(0,0,0,.8);
      }
    }
  `
}
