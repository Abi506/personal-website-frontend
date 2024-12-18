import {Route,Routes} from 'react-router-dom'
import Home from './components/home/home'
import WatchLater from './components/watchLater/watchLater'
import Nav from './components/nav/nav'
import Financials from './components/financials/financials'
import Affirmations from './components/affirmations/quote'
import Blog from './components/blog/blog'
const App=()=>{
  return(
    <>
    <Nav/>
    <Affirmations/>
  <Routes>
    <Route exact path='/' element={<Home/>} />
    <Route exact path='/watchLater' element={<WatchLater/>}/>
    <Route exact path='/financials' element={<Financials/>}/>
    <Route exact path='/blog' element={<Blog/>}/>
  </Routes>
  </>
  )
}
export default App 