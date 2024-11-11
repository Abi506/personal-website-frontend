import './home.css'
import TaskPrioriter from '../taskPrioriter/taskPrioriter'
import Affirmations from '../affirmations/quote'
import { Container } from 'react-bootstrap'
import {Link} from 'react-router-dom'
import Book from '../book/book'
import DisplayPdf from '../bookShow/bookShow'
import Financials from '../financials/financials'
const Home = () => {
  return (
    <Container className='home-container'>
   <Affirmations/>
   <div className='task-prioriter-container'>
   <TaskPrioriter/>
   </div>
   <Book/>
   <DisplayPdf/>
    </Container>
  )
}

export default Home
