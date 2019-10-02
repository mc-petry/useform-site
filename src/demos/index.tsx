import { H2 } from '@app/ui/typography/h2'
import { DemosArrayObject } from './array-object'
import { DemosArrayPrimitive } from './array-primitive'
import { DemosBase } from './base'
import { DemosWrapper } from './components/wrapper'
import { DemosDependent } from './dependent'
import { DemosDynamic } from './dynamic'
import { DemosTransformers } from './transformers'

export function Demos() {
  return <>
    <H2 id="demos">{'Demos'}</H2>

    <DemosWrapper
      header="Base form"
      src="master/src/demos/base.tsx"
      children={<DemosBase />}
    />

    <DemosWrapper
      header="Dynamic fields"
      src="master/src/demos/dynamic.tsx"
      children={<DemosDynamic />}
    />

    <DemosWrapper
      header="Dependent fields"
      src="master/src/demos/dependent.tsx"
      children={<DemosDependent />}
    />

    <DemosWrapper
      header="Transformers"
      src="master/src/demos/transformers.tsx"
      children={<DemosTransformers />}
    />

    <DemosWrapper
      header="Array of primitives"
      src="master/src/demos/array-primitive.tsx"
      children={<DemosArrayPrimitive />}
    />

    <DemosWrapper
      header="Array of objects"
      src="master/src/demos/array-object.tsx"
      children={<DemosArrayObject />}
    />
  </>
}
