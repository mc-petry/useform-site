import { css } from '@emotion/react'

const input = css`
  border: 1px solid #dddee4;
  border-radius: 4px;
  background: transparent;
  height: 40px;
  padding: 0 16px;
  color: #99a4b3;
  transition: all .15s;
  width: 100%;

  &:focus {
    border-color: #33b6c6;
    box-shadow: inset 0 15px 15px -15px rgba(51,182,198,.2);
    outline: none;
  }

  &:disabled {
    background: #f9f9fb;
  }
`

export default {
  field: css`
    margin: 0 0 20px;
    width: 100%;
  `,

  label: css`
    text-transform: uppercase;
    color: #687589;
    margin: 0 0 8px;
  `,

  input,

  error: css`
    .css-${input.name} {
      color: #415160;
      border-color: #cb8d82;
    }
  `,

  warn: css`
    .css-${input.name} {
      color: #415160;
      border-color: #ebd099;
    }
  `
}
