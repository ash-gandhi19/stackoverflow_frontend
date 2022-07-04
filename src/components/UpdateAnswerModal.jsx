import React, { useState } from 'react'
import { Button, Form, Modal } from 'react-bootstrap';
import axios from 'axios';
import { useFormik } from 'formik';
import * as Yup from "yup";
import { toast } from 'react-toastify';
import { FaSpinner } from 'react-icons/fa';


function UpdateAnswerModal({ answers, setAnswers, updateAnswer, showUpdateAnswer, setShowUpdateAnswer }) {

    const [isSubmitting, setIsSubmitting] = useState(false);

    const initialValues = {
        title: updateAnswer?.title || "",
        body: updateAnswer?.body || ""
    }

    const onSubmit = ({ title, body }) => {

        const updateAnswerCall = async () => {
            try {
                setIsSubmitting(true);

                const { data } = await axios.put(`/answers/update`, {
                    title: title,
                    body: body,
                    answerId: updateAnswer?._id
                }, {
                    headers: { "token": localStorage.getItem("token") }
                });

                const newAnswers = answers;

                newAnswers[newAnswers.findIndex(a => a._id === updateAnswer?._id)] = data;

                setAnswers([...newAnswers]);

                setShowUpdateAnswer(false);
                setIsSubmitting(false);

            }
            catch (err) {
                setShowUpdateAnswer(false);
                setIsSubmitting(false);
                console.error(err);
                toast.error("Error updating answer! Try again");
            }
        }

        updateAnswerCall();


        formik.resetForm();

    }

    const validationSchema = Yup.object({
        title: Yup.string()
            .required("required")
            .max(100, "max 100 characters allowed")
            .min(3, "min 3 character required"),
        body: Yup.string()
            .required("required")
            .max(5000, "max 5000 characters allowed")
            .min(3, "min 3 character required")
    });

    const formik = useFormik({
        initialValues,
        onSubmit,
        validationSchema,
        enableReinitialize: true
    });

    return <Modal show={showUpdateAnswer} onHide={() => setShowUpdateAnswer(false)}>
        <Modal.Header closeButton>
            <Modal.Title>Update answer</Modal.Title>
        </Modal.Header>
        <Modal.Body>
            <Form onSubmit={formik.handleSubmit}>
                <Form.Group className="mb-3" controlId="formBasicTitle">
                    <Form.Control type="text" placeholder="Enter answer title"
                        name="title"
                        value={formik.values.title}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                    />
                    {
                        formik.errors.title && formik.touched.title &&
                        <Form.Text className="redErrors">
                            {formik.errors.title}
                        </Form.Text>
                    }

                </Form.Group>
                <Form.Group className="mb-3" controlId="formBasicBody">
                    <Form.Control as="textarea" placeholder="Enter answer body"
                        name="body"
                        value={formik.values.body}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                    />
                    {
                        formik.errors.body && formik.touched.body &&
                        <Form.Text className="redErrors">
                            {formik.errors.body}
                        </Form.Text>
                    }

                </Form.Group>
                <div className="makeCommentRightFlex">
                    <Button variant="primary" type='submit' className="skyBlueButton">
                        {isSubmitting ? <>Submitting  <FaSpinner /> </> : <span>Update Answer</span>}
                    </Button>
                </div>

            </Form>
        </Modal.Body>

    </Modal>
}

export default UpdateAnswerModal;