import './home.css'
import TaskPrioriter from '../taskPrioriter/taskPrioriter'
import WatchLater from '../watchLater/watchLater'
import {Link} from 'react-router-dom'
const Home = () => {
  return (
    <div className='home-container'>
   <h1 style={{textAlign:'center'}}>Personal Website</h1>   
   <div className='task-prioriter-container'>
   <TaskPrioriter/>
   </div>
   <Link to="/watchLater">
   <button className='btn btn-success mt-5'>Watch Later Videos</button>
   </Link>
    </div>
  )
}

export default Home
