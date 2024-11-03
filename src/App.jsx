import {Route,Routes} from 'react-router-dom'
import Home from './components/home/home'
import WatchLater from './components/watchLater/watchLater'
const App=()=>{
  return(
  <Routes>
    <Route exact path='/' element={<Home/>} />
    <Route exact path='/watchLater' element={<WatchLater/>}/>
  </Routes>
  )
}
export default App 