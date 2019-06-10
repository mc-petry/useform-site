import css from '@emotion/css'
import { ReactNode } from 'react'

const style = css`
  font-size: 18px;
  color: #555;
  margin: 2em 0 1em;
`

export function H3({ children, ...rest }: { children: ReactNode }) {
  return <h3 css={style} {...rest}>{children}</h3>
}
