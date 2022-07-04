import { useFormik } from 'formik';
import React, { useState } from 'react'
import { Button, Form, Modal } from 'react-bootstrap';
import * as Yup from "yup";
import axios from 'axios';
import { toast } from 'react-toastify';
import { FaSpinner } from 'react-icons/fa';

function CreateAnswerModal({ answers, setAnswers, showAddAnswer, setShowAddAnswer, questionId }) {

    const [isSubmitting, setIsSubmitting] = useState(false);

    const initialAnswerValues = {
        title: "",
        body: "",
    };

    const answerSchema = Yup.object({
        title: Yup.string()
            .required("required")
            .max(100, "max 100 characters allowed")
            .min(3, "min 3 character required"),
        body: Yup.string()
            .required("required")
            .max(5000, "max 5000 characters allowed")
            .min(3, "min 3 character required")
    });

    const onAnswerSubmit = ({ title, body }) => {

        const addAnswer = async () => {
            try {
                setIsSubmitting(true);
                const { data } = await axios.post(`/answers/add`, {
                    title,
                    body,
                    questionId
                }, {
                    headers: { "token": localStorage.getItem("token") }
                });

                setAnswers([data, ...answers]);
                setShowAddAnswer(false);
                setIsSubmitting(false);
            }
            catch (err) {
                setIsSubmitting(false);
                console.error(err);
                toast.error("Error creating answer! Try again");
                setShowAddAnswer(false);
            }
        }

        addAnswer();


        formikAnswer.resetForm();

    }

    const formikAnswer = useFormik({
        initialValues: initialAnswerValues,
        onSubmit: onAnswerSubmit,
        validationSchema: answerSchema
    });

    return <Modal show={showAddAnswer} onHide={() => setShowAddAnswer(false)}>
        <Modal.Header closeButton>
            <Modal.Title>Add an answer</Modal.Title>
        </Modal.Header>
        <Modal.Body>
            <Form onSubmit={formikAnswer.handleSubmit}>
                <Form.Group className="mb-3" controlId="formBasicTitle">
                    <Form.Control type="text" placeholder="Enter answer title"
                        name="title"
                        value={formikAnswer.values.title}
                        onChange={formikAnswer.handleChange}
                        onBlur={formikAnswer.handleBlur}
                    />
                    {
                        formikAnswer.errors.title && formikAnswer.touched.title &&
                        <Form.Text className="redErrors">
                            {formikAnswer.errors.title}
                        </Form.Text>
                    }

                </Form.Group>
                <Form.Group className="mb-3" controlId="formBasicBody">
                    <Form.Control as="textarea" placeholder="Enter answer body"
                        name="body"
                        value={formikAnswer.values.body}
                        onChange={formikAnswer.handleChange}
                        onBlur={formikAnswer.handleBlur}
                    />
                    {
                        formikAnswer.errors.body && formikAnswer.touched.body &&
                        <Form.Text className="redErrors">
                            {formikAnswer.errors.body}
                        </Form.Text>
                    }

                </Form.Group>
                <div className="makeCommentRightFlex">
                    <Button variant="primary" type='submit' className="skyBlueButton">
                        {isSubmitting ? <>Submitting  <FaSpinner /> </> : <span>Post Answer</span>}
                    </Button>
                </div>

            </Form>
        </Modal.Body>

    </Modal>
}

export default CreateAnswerModal;