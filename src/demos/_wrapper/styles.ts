import { mq } from '@app/theme/media'
import css from '@emotion/css'

export default {
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
