import Hero from './Hero'
import SolvedProblems from './Solved'
import TrendingPosts from './Trending'

export default function Home() {
  return (
    <div>
      <Hero />
      <TrendingPosts />
      <SolvedProblems />
    </div>
  )
}
