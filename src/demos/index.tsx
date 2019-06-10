import { H2 } from '@app/ui/typography/h2'
import { DemosWrapper } from './_wrapper'
import { DemosDynamic } from './dynamic'
import { DemosSimple } from './simple'

export function Demos() {
  return <>
    <H2 id="demos">Demos</H2>

    <DemosWrapper
      header="Simple form"
      src="https://raw.githubusercontent.com/mc-petry/redux-handler/master/src/middleware.ts"
      url="https://raw.githubusercontent.com/mc-petry/redux-handler/master/src/middleware.ts"
      children={<DemosSimple />}
    />

    <DemosWrapper
      header="Dynamic field"
      src="https://raw.githubusercontent.com/mc-petry/redux-handler/master/src/middleware.ts"
      url="https://raw.githubusercontent.com/mc-petry/redux-handler/master/src/middleware.ts"
      children={<DemosDynamic />}
    />
  </>
}
