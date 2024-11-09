import React, { useEffect, useState } from 'react';
import { Carousel, Button, Modal, Form } from 'react-bootstrap';
import { FaRegEdit } from "react-icons/fa";
import { FaTrash } from "react-icons/fa";
import { quoteUrl } from '../apiUrl';
import axios from 'axios';
import './quote.css'

const Affirmations = () => {
  const [quotes, setQuotes] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false); // New state for delete confirmation modal
  const [currentQuote, setCurrentQuote] = useState({ text: '', author: '' });
  const [editId, setEditId] = useState(null);
  const [deleteId, setDeleteId] = useState(null); // New state to track which quote to delete

  // Fetch quotes and randomize order
  useEffect(() => {
    fetchQuotes();
  }, []);

  const fetchQuotes = async () => {
    try {
      const response = await axios.get(quoteUrl);
      const shuffledQuotes = response.data.sort(() => Math.random() - 0.5);
      setQuotes(shuffledQuotes);
    } catch (error) {
      console.error('Error fetching quotes:', error);
    }
  };

  const handleAddQuote = async () => {
    try {
      await axios.post(quoteUrl, currentQuote);
      fetchQuotes();
      setShowAddModal(false);
      setCurrentQuote({ text: '', author: '' });
    } catch (error) {
      console.error('Error adding quote:', error);
    }
  };

  const handleEditQuote = async () => {
    try {
      await axios.put(`${quoteUrl}/${editId}`, currentQuote);
      fetchQuotes();
      setShowEditModal(false);
      setCurrentQuote({ text: '', author: '' });
      setEditId(null);
    } catch (error) {
      console.error('Error updating quote:', error);
    }
  };

  const confirmDeleteQuote = (id) => {
    setDeleteId(id);
    setShowDeleteModal(true);
  };

  const handleDeleteQuote = async () => {
    try {
      await axios.delete(`${quoteUrl}${deleteId}`);
      fetchQuotes();
      setShowDeleteModal(false);
      setDeleteId(null);
    } catch (error) {
      console.error('Error deleting quote:', error);
    }
  };

  const openEditModal = (quote) => {
    setCurrentQuote({ text: quote.text, author: quote.author });
    setEditId(quote._id);
    setShowEditModal(true);
  };

  return (
    <div style={{backgroundColor:"#fff5fe",marginTop:"40px"}}>
        <div style={{textAlign:"right"}}>
        <Button variant="primary" style={{background:"transparent",borderColor:"blue",color:"blue"}} onClick={() => setShowAddModal(true)} className="mt-3">
        Add New Quote
      </Button>
      </div>
      <Carousel 
  interval={8000} 
  pause="hover" 
  style={{ width: "85%", maxWidth: "85%", margin: "0 auto" }}
>
  {quotes.map((quote) => (
    <Carousel.Item key={quote._id}>
      <div className="d-flex flex-column align-items-center p-4">
      {window.innerWidth<'400'&&(
          <h4 style={{padding:"15px",width:"370px"}} >"{quote.text}"</h4>
        )}
        
        {window.innerWidth>'400'&&(
          <h4 style={{padding:"15px",width:"500px"}} >"{quote.text}"</h4>
        )}
        <p>- {quote.author}</p>
        <div>
          <button 
            variant="warning" 
            className="btn" 
            onClick={() => openEditModal(quote)}
          >
            <FaRegEdit />
          </button>
          <button 
            variant="danger" 
            className="btn" 
            onClick={() => confirmDeleteQuote(quote._id)}
          >
            <FaTrash />
          </button>
        </div>
      </div>
    </Carousel.Item>
  ))}
</Carousel>


      {/* Add Quote Modal */}
      <Modal show={showAddModal} onHide={() => setShowAddModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Add a New Quote</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group>
              <Form.Label>Quote Text</Form.Label>
              <Form.Control
                type="text"
                value={currentQuote.text}
                onChange={(e) => setCurrentQuote({ ...currentQuote, text: e.target.value })}
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>Author</Form.Label>
              <Form.Control
                type="text"
                value={currentQuote.author}
                onChange={(e) => setCurrentQuote({ ...currentQuote, author: e.target.value })}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowAddModal(false)}>Close</Button>
          <Button variant="primary" onClick={handleAddQuote}>Save Quote</Button>
        </Modal.Footer>
      </Modal>

      {/* Edit Quote Modal */}
      <Modal show={showEditModal} onHide={() => setShowEditModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Edit Quote</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group>
              <Form.Label>Quote Text</Form.Label>
              <Form.Control
                type="text"
                value={currentQuote.text}
                onChange={(e) => setCurrentQuote({ ...currentQuote, text: e.target.value })}
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>Author</Form.Label>
              <Form.Control
                type="text"
                value={currentQuote.author}
                onChange={(e) => setCurrentQuote({ ...currentQuote, author: e.target.value })}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowEditModal(false)}>Close</Button>
          <Button variant="primary" onClick={handleEditQuote}>Update Quote</Button>
        </Modal.Footer>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Delete</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>Are you sure you want to delete this quote?</p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>Cancel</Button>
          <Button variant="danger" onClick={handleDeleteQuote}>Delete</Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default Affirmations;
