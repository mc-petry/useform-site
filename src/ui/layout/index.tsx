import { Global } from '@emotion/core'
import { ReactNode } from 'react'
import { LayoutHeader } from './header'
import styles from './styles'

export function Layout({ children }: { children: ReactNode }) {
  return <div css={styles.layout}>
    <LayoutHeader />
    <Global styles={styles.global} />
    {children}
  </div>
}
