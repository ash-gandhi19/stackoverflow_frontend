import React, { useState } from 'react'
import { Button, Modal } from 'react-bootstrap';
import axios from 'axios';
import { toast } from 'react-toastify';
import { FaSpinner } from 'react-icons/fa';

function DeleteCommentModal({
    question, setQuestion, showDeleteComment, setShowDeleteComment, deleteCommentId }) {

    const [isDeleting, setIsDeleting] = useState(false);

    const deleteComment = async () => {
        try {
            setIsDeleting(true);
            await axios.delete(`/comments/delete/${deleteCommentId}/${question._id}`, {
                headers: { "token": localStorage.getItem("token") }
            });

            const newQuestion = question;
            newQuestion.comments = newQuestion.comments.filter(c => c._id !== deleteCommentId);

            setShowDeleteComment(false);
            setQuestion({ ...newQuestion });

            setIsDeleting(false);
        }
        catch (err) {
            setIsDeleting(false);
            setShowDeleteComment(false);
            console.error(err);
            toast.error("Error deleting comment! Try again");
        }
    }

    return <Modal show={showDeleteComment} onHide={() => setShowDeleteComment(false)}>
        <Modal.Header closeButton>
            <Modal.Title>Deleting comment?</Modal.Title>
        </Modal.Header>
        <Modal.Body>
            Are you sure you want to permanently delete this comment?
        </Modal.Body>

        <Modal.Footer>
            <Button variant="danger" onClick={deleteComment}>
                {isDeleting ? <span className='spinnerSpan'>Deleting  <FaSpinner /> </span> : <span>Delete comment</span>}</Button>
        </Modal.Footer>

    </Modal>
}

export default DeleteCommentModal;