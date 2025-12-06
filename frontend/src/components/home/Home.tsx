import Hero from './Hero'
import SolvedProblems from './Solved'
import TopDevs from './Top'
import TrendingPosts from './Trending'

export default function Home() {
  return (
    <div>
      <Hero />
      <TrendingPosts />
      <SolvedProblems />
      <TopDevs />
    </div>
  )
}
