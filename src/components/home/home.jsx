import './home.css'
import TaskPrioriter from '../taskPrioriter/taskPrioriter'
import Affirmations from '../affirmations/quote'
import { Container } from 'react-bootstrap'
import {Link} from 'react-router-dom'
const Home = () => {
  return (
    <Container className='home-container'>
   <Affirmations/>
   <div className='task-prioriter-container'>
   <TaskPrioriter/>
   </div>
   <Link to="/watchLater">
   <button className='btn btn-success mt-5'>Watch Later Videos</button>
   </Link>
    </Container>
  )
}

export default Home
