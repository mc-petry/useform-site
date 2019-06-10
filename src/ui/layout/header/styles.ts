import css from '@emotion/css'

export default {
  header: css`
    position: absolute;
    left: 0;
    right: 0;
    z-index: 10;
  `,

  container: css`
    display: flex;
    align-items: center;
    padding-top: 16px;
  `,

  link: css`
    font-size: 18px;
    color: rgba(0,0,0,.7);
    text-decoration: none;
    transition: all .15s;

    :hover {
      color: #2d5696;
    }

    :not(:last-of-type) {
      margin-right: 40px;
    }
  `,

  git: css`
    fill: rgba(0,0,0,.7);
    transition: all .15s;
    display: flex;
    margin: 0 0 0 auto;
    transition: all .15s;

    :hover {
      fill: #2d5696;
    }
  `
}
