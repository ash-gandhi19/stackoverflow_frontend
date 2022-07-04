import { useContext, useState } from "react";
import { Container, Form, Button, Alert } from "react-bootstrap";
import { Link, Navigate } from "react-router-dom";
import { useFormik } from 'formik';
import * as Yup from "yup";
import axios from "axios";
import { FaStackOverflow } from "react-icons/fa";
import Loader from "../components/Loader";
import CommonContext from "../context/CommonContext";

export default function ForgotPassword() {

    const [errors, setErrors] = useState();
    const [successMsg, setSuccessMsg] = useState(false);
    const { isLoggedIn, setIsLoading } = useContext(CommonContext);


    const initialValues = {
        email: ""
    };

    const validationSchema = Yup.object({
        email: Yup.string()
            .email('Invalid email format')
            .required('Required')
    });

    const onSubmit = ({ email }) => {

        const uploadToBackend = async () => {
            try {
                setIsLoading(true);
                await axios.put(`/auth/forgotpassword`, {
                    email
                });

                setIsLoading(false);
                setSuccessMsg(true);
            }
            catch (err) {
                setIsLoading(false);
                setErrors(err?.response?.data);
                console.error(err);
            }
        }

        uploadToBackend();

    }

    const formik = useFormik({
        initialValues,
        onSubmit,
        validationSchema
    });

    return (
        isLoggedIn ? <Navigate to="/" /> :
            <Loader>
                <Container>
                    <div className="login">
                        {
                            successMsg ? <div className="errorAlert">
                                <Alert variant="success">
                                    Password reset link has been sent to your email.
                                </Alert>
                            </div> :
                                <div className="loginBody">
                                    <div className="loginBodyTop">
                                        <div className="loginLogo">
                                            <span className="logoSVG"><FaStackOverflow /> </span>
                                            <span className="logoStack">forgot</span>
                                            <span className="logoOverflow">-password</span>
                                        </div>
                                        {
                                            errors ? <div className="errorAlert">
                                                <Alert variant="danger">
                                                    {errors}
                                                </Alert>
                                            </div> : null
                                        }
                                        <Form onSubmit={formik.handleSubmit} >
                                            <Form.Group className="mb-3" controlId="formBasicEmail">
                                                <Form.Label>Email address</Form.Label>
                                                <Form.Control type="email" name="email" placeholder="Enter registered email"
                                                    onChange={formik.handleChange} value={formik.values.email}
                                                    onBlur={formik.handleBlur}
                                                />
                                                {
                                                    formik.errors.email && formik.touched.email ?
                                                        <Form.Text className="red">
                                                            {formik.errors.email}
                                                        </Form.Text> : null
                                                }
                                            </Form.Group>
                                            <Button className="skyBlueButton" type="submit">
                                                Submit
                                            </Button>
                                        </Form>
                                    </div>
                                    <div className="loginBodyBottom">
                                        <p>Wanna try logging in?
                                            <Link to="/login">
                                                <Button className="skyBlueButtonOutline" variant="outline-primary">Sign in</Button>
                                            </Link>
                                        </p>
                                    </div>
                                </div>
                        }
                    </div>
                </Container>
            </Loader>
    )
}