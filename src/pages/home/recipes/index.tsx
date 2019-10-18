import { H2 } from '@app/ui/typography/h2'
import { HomeRecipesDefaults } from './defaults'
import { HomeRecipesPerformance } from './performance'

export function HomeRecipes() {
  return <div>
    <H2 id="recipes">Recipes</H2>
    <HomeRecipesDefaults />
    <HomeRecipesPerformance />
  </div>
}
