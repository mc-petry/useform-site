import { LayoutContainer } from '@app/ui/layout/container'
import styles from './styles'

export function HomeLogo() {
  const blocks = 10

  return <div css={styles.wrapper}>
    <div css={styles.blocks}>
      {Array(blocks).fill(0).map((_, i) =>
        <div
          key={i}
          css={styles.block}
          style={{
            transform: `rotate(${90 / blocks * i}deg)`,
            opacity: .15 / blocks
          }}
        />
      )}
    </div>
    <LayoutContainer css={styles.container}>
      <div css={styles.logo}><span>use</span>form</div>
      <div css={styles.slogan}>A TypeScript library for building forms using React</div>
    </LayoutContainer>
  </div>
}
