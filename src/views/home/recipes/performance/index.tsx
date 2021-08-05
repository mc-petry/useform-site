import { Code, CodeLang } from '@app/ui/code'
import { H3 } from '@app/ui/typography/h3'
import { H4 } from '@app/ui/typography/h4'
import { Text } from '@app/ui/typography/text'

export function HomeRecipesPerformance() {
  return <div>
    <H3 id="performance">Performance</H3>
    <Text>
      <H4>Field</H4>

      <p>
        To prevent field from rerendering you can use <b>memoField</b>. It's works like React.memo
      </p>
      <Code lang={CodeLang.Markup}>{`import { memoField as memo } from '@mc-petry/useform'`}</Code>

      <H4>Child form</H4>

      <p>To prevent rerender parent form on child form changed you can pass <b>silence: true</b></p><Code lang={CodeLang.Markup}>{`useChildForm(index, field, form, true)`}</Code>
    </Text>
  </div>
}
