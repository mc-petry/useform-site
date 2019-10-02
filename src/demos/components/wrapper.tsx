import { mq } from '@app/theme/media'
import { Code } from '@app/ui/code'
import { Split } from '@app/ui/split'
import css from '@emotion/css'
import { ReactNode } from 'react'

interface Props {
  header: string
  src: string
  children: ReactNode
}

export function DemosWrapper({ header, src, children }: Props) {
  return <div css={styles.wrapper}>
    <div id={`demo-${header.toLowerCase().replace(/ /g, '-')}`} css={styles.header}>{header}</div>
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

const styles = {
  wrapper: css`
    margin: 0 0 32px;

    ${mq.mobile} {
      margin-bottom: 0;
    }
  `,

  header: css`
    color: #555;
    font-size: 20px;
    border-bottom: 1px solid #e1e1e1;
    padding: 24px 0 8px;
    margin: 0 0 32px;
  `,

  source: css`
    display: flex;
    flex-direction: column;
    padding: 22px 0 0;
  `,

  code: css`
    flex: 1 0 0;

    ${mq.mobile} {
      min-height: 50vh;
    }
  `
}
