import { LayoutContainer } from '@app/ui/layout/container'
import styles from './styles'

export function HomeLogo() {
  return <div css={styles.wrapper}>
    <LayoutContainer css={styles.container}>
      <div css={styles.logo}><span>use</span>form</div>
      <div css={styles.slogan}>A TypeScript library for building forms using React hooks</div>
    </LayoutContainer>
  </div>
}
