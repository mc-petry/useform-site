import { Field } from '@mc-petry/useform'
import { ChangeEvent, RefObject, useCallback } from 'react'
import { FieldMessage } from '../field-message'
import styles from './styles'

export interface TextFieldProps {
  field: Field<string>
  label?: string
  disabled?: boolean
}

export function TextField({ field, label, ...css }: TextFieldProps) {
  const onChange = useCallback((e: ChangeEvent<HTMLInputElement>) =>
    field.onChange(e.target.value),
    []
  )

  return <div
    css={[
      styles.field,
      field.error && styles.error || field.warn && styles.warn
    ]}
  >
    {label && <div css={styles.label}>{label}</div>}
    <input
      css={styles.input}
      ref={field.ref as RefObject<HTMLInputElement>}
      value={field.value || ''}
      onChange={onChange}
      onFocus={field.onFocus}
      onBlur={field.onBlur}
      type="text"
      {...css}
    />
    <FieldMessage field={field} />
  </div>
}
