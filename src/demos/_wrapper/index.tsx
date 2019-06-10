import { Code } from '@app/ui/code'
import { Split } from '@app/ui/split'
import { ReactNode } from 'react'
import styles from './styles'

interface Props {
  header: string
  src: string
  url: string
  children: ReactNode
}

export function DemosWrapper({ header, src, url, children }: Props) {
  return <div css={styles.wrapper}>
    <div css={styles.header}>{header}</div>
    <Split>
      <div>
        <div>{children}</div>
      </div>
      <div css={styles.source}>
        <Code css={styles.code} url={url} src={src} />
      </div>
    </Split>
  </div>
}
