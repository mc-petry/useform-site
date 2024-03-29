import { Demos } from '@app/demos'
import { HomeIntro } from '@app/views/home/intro'
import { HomeLogo } from '@app/views/home/logo'
import { HomeRecipes } from '@app/views/home/recipes'
import { Layout } from '@app/ui/layout'
import { LayoutBody } from '@app/ui/layout/body'
import { Sidebar } from '@app/ui/sidebar'
import { useEffect, useState } from 'react'

export default function Home() {
  const [rendered, setRendered] = useState(false)

  useEffect(() => {
    setRendered(true)
  })

  return <Layout>
    <HomeLogo />
    <LayoutBody sidebar={<Sidebar />}>
      <HomeIntro />
      <HomeRecipes />
      {rendered && <Demos />}
    </LayoutBody>
  </Layout>
}
