import {Route,Routes} from 'react-router-dom'
import Home from './components/home/home'
import WatchLater from './components/watchLater/watchLater'
import Nav from './components/nav/nav'
import Financials from './components/financials/financials'
const App=()=>{
  return(
    <>
    <Nav/>
  <Routes>
    <Route exact path='/' element={<Home/>} />
    <Route exact path='/watchLater' element={<WatchLater/>}/>
    <Route exact path='/financials' element={<Financials/>}/>
  </Routes>
  </>
  )
}
export default App 