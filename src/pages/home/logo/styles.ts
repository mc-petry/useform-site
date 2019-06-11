import { mq } from '@app/theme/media'
import css from '@emotion/css'

export default {
  wrapper: css`
    padding: 210px 0 210px;
    color: #000;
    font-weight: 300;
    position: relative;
    overflow: hidden;
    text-align: center;
    border-bottom: 1px solid #e2e8ec;

    ${mq.mobile} {
      padding: 0;
      height: calc(100% - 60px);
      text-align: left;
      display: flex;
    }
  `,

  logo: css`
    font-size: 68px;
    margin: 0 0 20px;
    font-weight: bold;

    span {
      color: rgba(0,0,0,.6);
    }

    ${mq.mobile} {
      font-size: 48px;
    }
  `,

  slogan: css`
    font-size: 30px;

    ${mq.mobile} {
      font-size: 20px;
    }
  `,

  container: css`
    margin: auto 0;
  `,

  blocks: css`
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
  `,

  block: css`
    position: absolute;
    width: 100%;
    height: 100%;
    background: rgb(0,50,130);
  `
}
