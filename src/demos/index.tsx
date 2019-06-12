import { H2 } from '@app/ui/typography/h2'
import { DemosWrapper } from './_wrapper'
import { DemosDependent } from './dependent'
import { DemosDynamic } from './dynamic'
import { DemosSimple } from './simple'
import { DemosTransformers } from './transformers'

export function Demos() {
  return <>
    <H2 id="demos">{'Demos'}</H2>

    <DemosWrapper
      header="Simple form"
      src="master/src/demos/simple/index.tsx"
      children={<DemosSimple />}
    />

    <DemosWrapper
      header="Dynamic fields"
      src="master/src/demos/dynamic/index.tsx"
      children={<DemosDynamic />}
    />

    <DemosWrapper
      header="Dependent fields"
      src="master/src/demos/dependent/index.tsx"
      children={<DemosDependent />}
    />

    <DemosWrapper
      header="Transformers"
      src="master/src/demos/transformers/index.tsx"
      children={<DemosTransformers />}
    />
  </>
}
