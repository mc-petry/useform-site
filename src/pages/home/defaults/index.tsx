import { mq } from '@app/theme/media'
import { Code } from '@app/ui/code'
import { H2 } from '@app/ui/typography/h2'
import { H3 } from '@app/ui/typography/h3'
import { Text } from '@app/ui/typography/text'
import css from '@emotion/css'

const styles = {
  code: css`
    max-height: 300px;

    ${mq.mobile} {
      max-height: 50vh;
    }
  `
}

export function HomeDefaults() {
  return <div>
    <H2 id="defaults">Form defaults</H2>
    <Text>
      <H3>Define your own form factory</H3>
      <Code
        css={styles.code}
        fullSource
      >{`import { FormOptions, useForm as _useForm } from '@mc-petry/useform'
import { useCallback } from 'react'

interface ErrorTransformer {
  //
}

export function useForm<T extends { [key: string]: any }>(getInitialOptions?: () => FormOptions<T, ErrorTransformer>) {
  const getOptions = useCallback(() => {
    const opts: FormOptions<T, ErrorTransformer> = {
      validateOnChange: true,
      // ... other defaults like transformers

      ...getInitialOptions ? getInitialOptions() : {}
    }

    return opts
  }, [])

  return _useForm<T, ErrorTransformer>(getOptions)
}`}
      </Code>
    </Text>
  </div>
}
