import { H2 } from '@app/ui/typography/h2'
import { DemosWrapper } from './_wrapper'
import { DemosDynamic } from './dynamic'
import { DemosSimple } from './simple'

export function Demos() {
  return <>
    <H2 id="demos">Demos</H2>

    <DemosWrapper
      header="Simple form"
      src="master/src/demos/simple/index.tsx"
      children={<DemosSimple />}
    />

    <DemosWrapper
      header="Dynamic field"
      src="master/src/demos/dynamic/index.tsx"
      children={<DemosDynamic />}
    />
  </>
}
