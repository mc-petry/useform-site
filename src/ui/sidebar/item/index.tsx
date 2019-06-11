import { mq } from '@app/theme/media'
import css from '@emotion/css'

const styles = {
  item: css`
    padding: 16px 16px 16px 64px;
    display: block;
    position: relative;
    transition: all .15s;
    cursor: pointer;
    font-size: 16px;
    color: #666;
    text-decoration: none;

    ::after {
      content: "";
      display: block;
      position: absolute;
      left: 0;
      right: 0;
      bottom: 0;
      height: 1px;
      background: linear-gradient(-90deg, #e2e8ec, transparent);
    }

    :hover {
      background: linear-gradient(-90deg, rgba(0,30,100,.05), transparent);
    }

    ${mq.mobile} {
      color: #09f;
      font-size: 20px;
      padding: 0;
      display: inline;
      margin: 0 0 20px;
      background: none !important;

      ::after {
        display: none;
      }
    }
  `,

  sub: css`
    padding-left: 80px;

    ${mq.mobile} {
      padding-left: 16px;
      font-size: 18px;
    }
  `
}

export function SidebarItem({ header, link, sub }: { header: string, link: string, sub?: boolean }) {
  return <a css={[styles.item, sub && styles.sub]} href={link}>{header}</a>
}
