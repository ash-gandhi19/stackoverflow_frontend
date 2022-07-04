import React, { useState } from 'react'
import { Button, Form, Modal } from 'react-bootstrap';
import axios from 'axios';
import { useFormik } from 'formik';
import * as Yup from "yup";
import { toast } from 'react-toastify';
import { FaSpinner } from 'react-icons/fa';

function CreateCommentModal({ showAddComment, questionId, setQuestion, commentRef, setShowAddComment }) {
    const [isSubmitting, setIsSubmitting] = useState(false);

    const initialValues = {
        comment: ""
    };

    const validationSchema = Yup.object({
        comment: Yup.string()
            .required("required")
            .max(50, "max 50 characters allowed")
            .min(1, "min 1 character required")
    });

    const onSubmit = ({ comment }) => {

        const addComment = async () => {
            try {

                setIsSubmitting(true);
                const { data } = await axios.post(`/comments/add`, {
                    comment,
                    questionId
                }, {
                    headers: { "token": localStorage.getItem("token") }
                });

                setQuestion(data);

                commentRef.current?.scrollIntoView({
                    behavior: 'smooth', block: 'end'
                });
                setShowAddComment(false);
                setIsSubmitting(false);

            }
            catch (err) {
                setIsSubmitting(false);
                console.error(err);
                toast.error("Error creating comment! Try again");
                setShowAddComment(false);
            }
        }

        addComment();
        formik.resetForm();

    }

    const formik = useFormik({
        initialValues,
        onSubmit,
        validationSchema
    });

    return <Modal show={showAddComment} onHide={() => setShowAddComment(false)}>
        <Modal.Header closeButton>
            <Modal.Title>Add a comment</Modal.Title>
        </Modal.Header>
        <Modal.Body>
            <Form onSubmit={formik.handleSubmit}>
                <Form.Group className="mb-3" controlId="formBasicComment">
                    <Form.Control type="text" placeholder="Enter comment"
                        name="comment"
                        value={formik.values.comment}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                    />
                    {
                        formik.errors.comment && formik.touched.comment &&
                        <Form.Text className="redErrors">
                            {formik.errors.comment}
                        </Form.Text>
                    }

                </Form.Group>
                <div className="makeCommentRightFlex">
                    <Button variant="primary" type='submit' className="skyBlueButton">
                        {isSubmitting ? <>Submitting  <FaSpinner /> </> : <span>Post Comment</span>}
                    </Button>
                </div>

            </Form>
        </Modal.Body>

    </Modal>
}

export default CreateCommentModal;