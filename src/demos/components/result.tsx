import { css } from '@emotion/react'

export function DemosResult({ result }: { result: {} | undefined }) {
  return <pre css={styles.result}>
    {result === undefined ? '' : JSON.stringify(result, null, 2)}
  </pre>
}

const styles = {
  result: css`
    color: #aaa;
    margin: 20px 0 0;
    padding: 16px;
    border: 1px solid rgba(0,0,0,.2);
    border-radius: 4px;
    background: #051937;
  `
}
