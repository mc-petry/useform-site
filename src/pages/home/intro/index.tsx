import { mq } from '@app/theme/media'
import { Code, CodeLang } from '@app/ui/code'
import { H2 } from '@app/ui/typography/h2'
import { H4 } from '@app/ui/typography/h4'
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

export function HomeIntro() {
  return <div>
    <H2 id="quick-start">Quick start</H2>
    <Text>
      <H4>Install the library</H4>
      <Code lang={CodeLang.Markup}>
        {'npm i @mc-petry/useform'}
      </Code>
      <H4>Create custom field</H4>
      <Code
        src="master/src/ui/forms/text-field/index.tsx"
        css={styles.code}
      >{`import { ChangeEvent, useCallback } from 'react'
import { Field } from '@mc-petry/useform'

function TextField({ field }: { field: Field }) {
  const onChange = useCallback((e: ChangeEvent<HTMLInputElement>) =>
    field.onChange(e.target.value),
    []
  )

  return <div>
    <input
      ref={field.ref as any}
      value={field.value || ''}
      onChange={onChange}
      onFocus={field.onFocus}
      onBlur={field.onBlur}
      type="text"
    />
  </div>
}`}
      </Code>
      <p>For each field type you must create your own component or wrap component from third-party library.</p>
    </Text>
  </div>
}
