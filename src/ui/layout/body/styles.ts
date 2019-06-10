import { mq } from '@app/theme/media'
import css from '@emotion/css'

export default {
  wrapper: css`
    display: flex;
    flex-direction: row-reverse;

    ${mq.mobile} {
      flex-direction: column-reverse;
    }
  `,

  sidebar: css`
    flex: 0 0 280px;
    border-right: 1px solid #e2e8ec;
    background: linear-gradient(-90deg, #eff7fc, transparent);

    ${mq.mobile} {
      flex: 1;
      border: none;
      border-bottom: 1px solid #e2e8ec;
      background: none;
    }
  `,

  children: css`
    max-width: calc(100% - 280px);
    padding: 20px 0 0 48px;

    ${mq.mobile} {
      max-width: none;
      padding: 0;
    }
  `
}
