import { Container, Form, Button } from 'react-bootstrap';
import { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useFormik } from 'formik';
import * as Yup from "yup";
import Loader from '../components/Loader';
import CommonContext from '../context/CommonContext';
import { toast } from 'react-toastify';

export default function UpdateProfile() {

    const [user, setUser] = useState();

    const { setIsLoading } = useContext(CommonContext);
    const navi = useNavigate();

    useEffect(() => {

        //api call to get user info
        const getUser = async () => {

            try {
                setIsLoading(true);
                const { data } = await axios.get(`/users/profile`,
                    { headers: { "token": localStorage.getItem("token") } }
                );

                setUser(data);
                setIsLoading(false);
            }
            catch (err) {
                setIsLoading(false);
                toast.error("Error fetching  user data from server!");
                console.error(err);
            }
        }

        getUser();

    }, [setIsLoading]);

    const initialValues = {
        fullName: user?.fullName || "",
        qualification: user?.qualification || "",
        yearsOfExperience: user?.yearsOfExperience || "",
        yearOfPassing: user?.yearOfPassing || "",
    };

    const validationSchema = Yup.object({
        fullName: Yup.string()
            .min(4, "minimum 4 characters")
            .max(50, "maximum 50 characters"),
        qualification: Yup.string()
            .min(3, "minimum 3 characters")
            .max(50, "maximum 50 characters"),
        yearsOfExperience: Yup.string()
            .min(1, "minimum 1 characters")
            .max(15, "maximum 15 characters"),
        yearOfPassing: Yup.string()
            .min(3, "minimum 3 characters")
            .max(20, "maximum 20 characters")

    });

    const onSubmit = ({ fullName, qualification, yearsOfExperience, yearOfPassing }) => {

        // api call to update user
        const uploadToBackend = async () => {
            try {
                setIsLoading(true);

                const body = { fullName, qualification, yearsOfExperience, yearOfPassing };

                await axios.put(`/users/update`, body,
                    {
                        headers: { "token": localStorage.getItem("token") }
                    });

                setIsLoading(false);
               navi(`/profile`);
            }
            catch (err) {
                setIsLoading(false);
                toast.error("Couldnt update user. Try later...");
                console.error(err);
            }
        }

        uploadToBackend();

    }

    const formik = useFormik({
        initialValues,
        onSubmit,
        validationSchema,
        enableReinitialize: true
    });



    return <Loader>

        <Container>

            <div className="homeWrapper">
                <div className="homeTop">
                    <h2>Update profile</h2>
                </div>

                <div className="askQuestionBottom">

                    <Form onSubmit={formik.handleSubmit} >

                        <Form.Group className="mb-3" controlId="formBasicName">
                            <Form.Label>Full name</Form.Label>
                            <Form.Control type="text" name="fullName"
                                value={formik.values.fullName} placeholder="Enter full name"
                                onChange={formik.handleChange} onBlur={formik.handleBlur} />
                            {
                                formik.errors.fullName && formik.touched.fullName ?
                                    <Form.Text className="redErrors">
                                        {formik.errors.fullName}
                                    </Form.Text> : null
                            }

                        </Form.Group>
                        <Form.Group className="mb-3" controlId="formBasicQuali">
                            <Form.Label>Qualification</Form.Label>
                            <Form.Control as="textarea" rows={6} name="qualification"
                                value={formik.values.qualification} placeholder="Enter question qualification"
                                onChange={formik.handleChange} onBlur={formik.handleBlur} />
                            {
                                formik.errors.qualification && formik.touched.qualification ?
                                    <Form.Text className="redErrors">
                                        {formik.errors.qualification}
                                    </Form.Text> : null
                            }

                        </Form.Group>

                        <Form.Group className="mb-3" controlId="formBasicExp">
                            <Form.Label>Experience</Form.Label>
                            <Form.Control type="text" name="yearsOfExperience"
                                value={formik.values.yearsOfExperience} placeholder="Enter experience eg. 3 years/6months"
                                onChange={formik.handleChange} onBlur={formik.handleBlur} />
                            {
                                formik.errors.yearsOfExperience && formik.touched.yearsOfExperience ?
                                    <Form.Text className="redErrors">
                                        {formik.errors.yearsOfExperience}
                                    </Form.Text> : null
                            }

                        </Form.Group>
                        <Form.Group className="mb-3" controlId="formBasicPassing">
                            <Form.Label>Year of graduation</Form.Label>
                            <Form.Control as="textarea" rows={6} name="yearOfPassing"
                                value={formik.values.yearOfPassing} placeholder="Enter year"
                                onChange={formik.handleChange} onBlur={formik.handleBlur} />
                            {
                                formik.errors.yearOfPassing && formik.touched.yearOfPassing ?
                                    <Form.Text className="redErrors">
                                        {formik.errors.yearOfPassing}
                                    </Form.Text> : null
                            }

                        </Form.Group>

                        <Button variant="primary" type="submit" className="postButton">
                            Submit
                        </Button>
                    </Form>
                </div>

            </div>
        </Container>
    </Loader>

}