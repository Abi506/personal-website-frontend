import './home.css'
import TaskPrioriter from '../taskPrioriter/taskPrioriter'
const Home = () => {
  return (
    <div className='home-container'>
   <h1 style={{textAlign:'center'}}>Personal Website</h1>   
   <div className='task-prioriter-container'>
   <TaskPrioriter/>
   </div>
    </div>
  )
}

export default Home
