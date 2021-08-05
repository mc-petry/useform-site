import { mq } from '@app/theme/media'
import { Code } from '@app/ui/code'
import { H3 } from '@app/ui/typography/h3'
import { H4 } from '@app/ui/typography/h4'
import { Text } from '@app/ui/typography/text'
import { css } from '@emotion/react'

const styles = {
  code: css`
    max-height: 300px;

    ${mq.mobile} {
      max-height: 50vh;
    }
  `
}

export function HomeRecipesDefaults() {
  return <div>
    <H3 id="defaults">Form defaults</H3>
    <Text>
      <H4>Define your own form factory</H4>
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
