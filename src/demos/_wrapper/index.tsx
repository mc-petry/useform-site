import { Code } from '@app/ui/code'
import { Split } from '@app/ui/split'
import { ReactNode } from 'react'
import styles from './styles'

interface Props {
  header: string
  src: string
  children: ReactNode
}

export function DemosWrapper({ header, src, children }: Props) {
  return <div css={styles.wrapper}>
    <div id={`demo-${header.toLowerCase().replace(' ', '-')}`} css={styles.header}>{header}</div>
    <Split>
      <div>
        <div>{children}</div>
      </div>
      <div css={styles.source}>
        <Code css={styles.code} src={src} />
      </div>
    </Split>
  </div>
}
