import { Container, Form, Button, Alert } from "react-bootstrap";
import { FaStackOverflow } from "react-icons/fa";

import { Link, useNavigate, Navigate } from "react-router-dom";
import { useFormik } from 'formik';
import * as Yup from "yup";

import axios from "axios";

import { useContext, useState } from "react";
import Loader from "../components/Loader";
import CommonContext from "../context/CommonContext";

export default function Signup() {

    const [errors, setErrors] = useState();
    const { isLoggedIn, setIsLoading } = useContext(CommonContext);

    const navi = useNavigate();

    const initialValues = {
        fullName: "",
        email: "",
        userName: "",
        password: ""
    }

    const validationSchema = Yup.object({
        fullName: Yup.string()
            .required('Required')
            .min(4, "minimum 4 characters")
            .max(50, "maximum 50 characters"),
        userName: Yup.string()
            .required('Required')
            .min(3, "minimum 3 characters")
            .max(12, "maximum 12 characters"),
        email: Yup.string()
            .email('Invalid email format')
            .required('Required'),
        password: Yup.string()
            .required('Required')
            .min(6, "minimum 6 characters")
            .max(100, "maximum 100 characters")
    });

    const onSubmit = ({ fullName, userName, email, password }) => {

        const uploadToBackend = async () => {
            try {
                setIsLoading(true);
                await axios.post(`/auth/register`, {
                    fullName,
                    userName,
                    email,
                    password
                });
                setIsLoading(false);

                navi("/login");
            }
            catch (err) {
                setIsLoading(false);
                setErrors(err?.response?.data);
                console.error(err);

            }
        }

        uploadToBackend();

    };

    const formik = useFormik({
        initialValues,
        onSubmit,
        validationSchema
    });

    return (
        isLoggedIn ? <Navigate to="/" /> :
            <Loader>
                <Container>
                    <div className="register">
                        <div className="loginBody">
                            <div className="loginBodyTop">
                                <div className="loginLogo">
                                    <span className="logoSVG"><FaStackOverflow /> </span>
                                    <span className="logoStack">stack</span>
                                    <span className="logoOverflow">Register</span>
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
                                        <Form.Control type="email" name="email" placeholder="Enter email"
                                            onChange={formik.handleChange} value={formik.values.email}
                                            onBlur={formik.handleBlur}
                                        />
                                        {
                                            formik.errors.email && formik.touched.email ?
                                                <Form.Text className="redErrors">
                                                    {formik.errors.email}
                                                </Form.Text> : null
                                        }
                                    </Form.Group>
                                    <Form.Group className="mb-3" controlId="formBasicText">
                                        <Form.Label>Full Name</Form.Label>
                                        <Form.Control type="text" name="fullName" value={formik.values.fullName} placeholder="Enter full name" onChange={formik.handleChange} onBlur={formik.handleBlur} />
                                        {
                                            formik.errors.fullName && formik.touched.fullName ?
                                                <Form.Text className="redErrors">
                                                    {formik.errors.fullName}
                                                </Form.Text> : null
                                        }
                                    </Form.Group>
                                    <Form.Group className="mb-3" controlId="formBasicUn">
                                        <Form.Label>User Name</Form.Label>
                                        <Form.Control type="text" name="userName" value={formik.values.userName} placeholder="Enter userName" onChange={formik.handleChange} onBlur={formik.handleBlur} />
                                        {
                                            formik.errors.userName && formik.touched.userName ?
                                                <Form.Text className="redErrors">
                                                    {formik.errors.userName}
                                                </Form.Text> : null
                                        }
                                    </Form.Group>
                                    <Form.Group className="mb-3" controlId="formBasicPassword">
                                        <Form.Label>Password</Form.Label>
                                        <Form.Control type="password" name="password"
                                            value={formik.values.password} placeholder="Min 6 characters" onChange={formik.handleChange} onBlur={formik.handleBlur} />
                                        {
                                            formik.errors.password && formik.touched.password ?
                                                <Form.Text className="redErrors">
                                                    {formik.errors.password}
                                                </Form.Text> : null
                                        }
                                    </Form.Group>
                                    <Button type="submit" className="skyBlueButton">
                                        Sign up
                                    </Button>
                                </Form>
                            </div>
                            <div className="loginBodyBottom">
                                <p>Have an account already?
                                    <Link to="/login">
                                        <Button className="skyBlueButtonOutline" variant="outline-primary">Sign in</Button>
                                    </Link>
                                </p>
                            </div>
                        </div>
                    </div>
                </Container>
            </Loader>
    )
}