import React, { useContext } from 'react'
import { Button, Modal } from 'react-bootstrap';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import CommonContext from '../context/CommonContext';
import { toast } from 'react-toastify';

export default function DeleteQuestionModal({ questionId, showDeleteQuestion, setShowDeleteQuestion }) {

    const navi = useNavigate();
    const { setIsLoading } = useContext(CommonContext);

    const deleteQuestion = async () => {
        try {
            setIsLoading(true);
            await axios.delete(`/questions/delete/${questionId}`, {
                headers: { "token": localStorage.getItem("token") }
            });

            setShowDeleteQuestion(false);
            setIsLoading(false);

            navi("/questions");

        }
        catch (err) {
            setIsLoading(false);
            console.error(err);
            setShowDeleteQuestion(false);
            toast.error("Error deleting question!");
        }
    }

    return <Modal show={showDeleteQuestion} onHide={() => setShowDeleteQuestion(false)}>
        <Modal.Header closeButton>
            <Modal.Title>Deleting question?</Modal.Title>
        </Modal.Header>
        <Modal.Body>
            Are you sure you want to permanently delete this question?
        </Modal.Body>

        <Modal.Footer>
            <Button variant="danger" onClick={deleteQuestion}>Delete question</Button>
        </Modal.Footer>

    </Modal>
}