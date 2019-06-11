import { mq } from '@app/theme/media'
import css from '@emotion/css'
import { SidebarItem } from './item'

const styles = {
  sidebar: css`
    position: sticky;
    top: 0;
    padding: 36px 0 0;
    display: flex;
    flex-direction: column;

    ${mq.mobile} {
      position: static;
      margin: 0 0 20px;
      padding-top: 18px;
      border-bottom: 1px solid #e2e8ec;
    }
  `
}

export function Sidebar() {
  return <div css={styles.sidebar}>
    <SidebarItem header="Quick start" link="#quick-start" />
    <SidebarItem header="Demos" link="#demos" />
    <SidebarItem sub header="Simple form" link="#demo-simple-form" />
    <SidebarItem sub header="Dynamic field" link="#demo-dynamic-field" />
  </div>
}
