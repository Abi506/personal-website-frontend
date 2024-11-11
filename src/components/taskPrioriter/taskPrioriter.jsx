import { useState, useEffect } from 'react';
import axios from 'axios';
import { taskPrioriterUrl } from '../apiUrl';
import { Table, Form, Button, Modal } from 'react-bootstrap';
import './taskPrioriter.css';

const TaskPrioriter = () => {
    const [taskData, setTaskData] = useState([]);
    const [error, setError] = useState(null);
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [priority, setPriority] = useState(1);
    const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
    const [showForm, setShowForm] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [taskToDelete, setTaskToDelete] = useState(null);
    const [isTabletOrLarger, setIsTabletOrLarger] = useState(window.innerWidth >= 768);
    const [selectedTaskId, setSelectedTaskId] = useState(null);

    const todayDate = new Date().toISOString().split('T')[0];

    useEffect(() => {
        fetchTasks(todayDate);
    }, [todayDate]);

    useEffect(() => {
        const handleResize = () => {
            setIsTabletOrLarger(window.innerWidth >= 768);
        };
        
        window.addEventListener('resize', handleResize);
        handleResize();

        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const fetchTasks = async (date) => {
        try {
            const response = await axios.get(`${taskPrioriterUrl}/${todayDate}`);
            const sortedTasks = response.data.sort((a, b) => b.priority - a.priority);
            setTaskData(sortedTasks);
        } catch (err) {
            setError('Error fetching task data');
            console.error(err);
        }
    };

    const handleAddTask = async (e) => {
        e.preventDefault();
        try {
            const newTask = {
                title,
                description,
                priority,
                status: 'Pending',
                date: selectedDate,
            };
            const response = await axios.post(taskPrioriterUrl, newTask);
            const updatedTasks = [...taskData, response.data].sort((a, b) => b.priority - a.priority);
            setTaskData(updatedTasks);
            setTitle('');
            setDescription('');
            setPriority(1);
            setSelectedDate(todayDate);
            setShowForm(false);
        } catch (err) {
            setError('Error adding task');
            console.error(err);
        }
    };

    const handleChangeStatus = async (id, newStatus) => {
        try {
            await axios.put(`${taskPrioriterUrl}/${id}`, { status: newStatus });
            setTaskData(taskData.map((task) => (task._id === id ? { ...task, status: newStatus } : task)));
        } catch (err) {
            console.error('Error updating task status', err);
        }
    };

    const handleDeleteTask = async () => {
        try {
            await axios.delete(`${taskPrioriterUrl}/${taskToDelete}`);
            setTaskData(taskData.filter((task) => task._id !== taskToDelete));
            setShowDeleteModal(false);
        } catch (err) {
            console.error('Error deleting task', err);
        }
    };

    const toggleTaskDescription = (taskId) => {
        setSelectedTaskId(taskId === selectedTaskId ? null : taskId);
    };

    return (
        <div className='task-prioriter-container' style={{backgroundColor:"f8f8ff"}}>
            <h1 className='task-prioriter-heading'>Task Prioriter</h1>
            <p>Today's Date: {todayDate}</p>
            {error && <p style={{ color: 'red' }}>{error}</p>}

            <Table striped bordered hover className='custom-table-styles'>
                <thead>
                    <tr>
                        <th className='table-title-column'>Title</th>
                        <th className='table-status-column'>Status</th>
                        <th className='table-priority-column'>Priority Level</th>
                        <th className='table-actions-column'>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {taskData.length > 0 ? (
                        taskData.map((task) => (
                            <>
                                <tr key={task._id} onClick={() => toggleTaskDescription(task._id)}>
                                    <td className='task-heading table-title-column'>{task.title}</td>
                                    <td className='table-status-column'>
                                        <Form.Control
                                            as='select'
                                            value={task.status}
                                            onChange={(e) => handleChangeStatus(task._id, e.target.value)}
                                        >
                                            <option value='Pending'>Pending</option>
                                            <option value='Completed'>Completed</option>
                                        </Form.Control>
                                    </td>
                                    <td className='table-priority-column'>{task.priority}</td>
                                    <td className='table-actions-column'>
                                        <Button variant='danger' onClick={(e) => { e.stopPropagation(); setTaskToDelete(task._id); setShowDeleteModal(true); }}>
                                            Delete
                                        </Button>
                                    </td>
                                </tr>
                                {selectedTaskId === task._id && (
                                    <tr>
                                        <td colSpan="5" className='task-details'>
                                            <strong>Description:</strong> {task.description}
                                        </td>
                                    </tr>
                                )}
                            </>
                        ))
                    ) : (
                        <tr>
                            <td colSpan=''>No Tasks Available</td>
                        </tr>
                    )}
                </tbody>
            </Table>

            <Button variant='primary' onClick={() => setShowForm(!showForm)} style={{marginBottom:"20px"}}>
                {showForm ? 'Cancel' : 'Add New Task'} 
            </Button>
            {showForm && (
    <Form onSubmit={handleAddTask} className='task-custom-form'>
        <Form.Group controlId='formTaskTitle'>
            <Form.Label>Title</Form.Label>
            <Form.Control
                type='text'
                placeholder='Enter task title'
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
            />
        </Form.Group>

        <Form.Group controlId='formTaskDescription'>
            <Form.Label>Description</Form.Label>
            <Form.Control
                as='textarea'
                rows={3}
                placeholder='Enter task description'
                value={description}
                onChange={(e) => setDescription(e.target.value)}
            />
        </Form.Group>

        <Form.Group controlId='formTaskPriority'>
            <Form.Label>Priority Level (1-100)</Form.Label>
            <Form.Control
                type='number'
                placeholder='Enter priority level'
                value={priority}
                onChange={(e) => {
                    const value = Number(e.target.value);
                    if (value >= 1 && value <= 100) {
                        setPriority(value);
                    }
                }}
                min={1}
                max={100}
                required
            />
        </Form.Group>

        <Form.Group controlId='formTaskDate'>
            <Form.Label>Date</Form.Label>
            <Form.Control
                as='select'
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                required
            >
                {Array.from({ length: 7 }, (_, index) => {
                    const date = new Date();
                    date.setDate(date.getDate() + index);
                    const formattedDate = date.toISOString().split('T')[0]; // Format to YYYY-MM-DD
                    return (
                        <option key={formattedDate} value={formattedDate}>
                            {formattedDate}
                        </option>
                    );
                })}
            </Form.Control>
        </Form.Group>

        <Button variant='success' type='submit'>
            Add Task
        </Button>
    </Form>
)}


            <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Confirm Delete</Modal.Title>
                </Modal.Header>
                <Modal.Body>Are you sure you want to delete this task?</Modal.Body>
                <Modal.Footer>
                    <Button variant='secondary' onClick={() => setShowDeleteModal(false)}>
                        Cancel
                    </Button>
                    <Button variant='danger' onClick={handleDeleteTask}>
                        Delete
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
};

export default TaskPrioriter;
