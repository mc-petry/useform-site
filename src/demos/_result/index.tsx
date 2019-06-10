import styles from './styles'

export function DemosResult({ result }: { result: {} | undefined }) {
  return <pre css={styles.result}>
    {result === undefined ? '' : JSON.stringify(result, null, 2)}
  </pre>
}
