import React, { useState } from 'react'
import { Button, Modal } from 'react-bootstrap';
import axios from 'axios';
import { toast } from 'react-toastify';
import { FaSpinner } from 'react-icons/fa';

function DeleteAnswerModal({
    answers, setAnswers, deleteAnswerId, showDeleteAnswer, setShowDeleteAnswer }) {

    const [isDeleting, setIsDeleting] = useState(false);

    const deleteAnswer = async () => {
        try {
            setIsDeleting(true);
            await axios.delete(`/answers/delete/${deleteAnswerId}/${answers[0]?.questionId}`, {
                headers: { "token": localStorage.getItem("token") }
            });

            let newAnswers = answers;
            newAnswers = newAnswers.filter(a => a._id !== deleteAnswerId);

            setShowDeleteAnswer(false);
            setAnswers([...newAnswers]);
            setIsDeleting(false);
        }
        catch (err) {
            setIsDeleting(false);
            console.error(err);
            setShowDeleteAnswer(false);
            toast.error("Error deleting answer! Try again");
        }
    }

    return <Modal show={showDeleteAnswer} onHide={() => setShowDeleteAnswer(false)}>
        <Modal.Header closeButton>
            <Modal.Title>Deleting answer?</Modal.Title>
        </Modal.Header>
        <Modal.Body>
            Are you sure you want to permanently delete this answer?
        </Modal.Body>

        <Modal.Footer>
            <Button variant="danger" onClick={deleteAnswer}>
                {isDeleting ? <span className='spinnerSpan'>Deleting  <FaSpinner /> </span> : <span>Delete answer</span>}
            </Button>
        </Modal.Footer>

    </Modal>
}

export default DeleteAnswerModal;