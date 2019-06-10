import Prism from 'prismjs'
import 'prismjs/components/prism-typescript'
import 'prismjs/themes/prism.css'
import { useCallback, useEffect, useState } from 'react'
import styles from './styles'

export enum CodeLang {
  TS = 'typescript',
  Markup = 'markup'
}

interface Props {
  children?: string
  lang?: CodeLang
  url?: string

  /**
   * Path to raw file
   */
  src?: string
}

export function Code({ children, src, url, lang = CodeLang.TS, ...css }: Props) {
  const [source, setSource] = useState('')

  const highlight = useCallback((text: string) => setSource(Prism.highlight(text, Prism.languages[lang], lang)), [lang])

  useEffect(() => {
    if (children) {
      highlight(children)
    }
  }, [children])

  useEffect(() => {
    if (src && !children) {
      fetch(src)
        .then(value => value.text())
        .then(text => highlight(text))
    }
  }, [])

  return <>
    {url &&
      <div css={styles.sourceLabel}>
        <a css={styles.sourceLink} href={url} target="_blank">Source</a>
      </div>
    }
    <div css={[styles.wrapper, lang === CodeLang.Markup && styles.langMarkup]} {...css}>
      <pre css={styles.code}>
        <code dangerouslySetInnerHTML={{ __html: source }} />
      </pre>
    </div>
  </>
}
