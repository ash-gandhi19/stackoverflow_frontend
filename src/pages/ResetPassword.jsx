import { Container, Form, Button, Alert } from "react-bootstrap";
import { Navigate, useParams, useNavigate } from "react-router-dom";
import { useFormik } from 'formik';
import * as Yup from "yup";

import axios from "axios";

import { useContext, useState } from "react";
import CommonContext from "../context/CommonContext";
import { FaStackOverflow } from "react-icons/fa";
import Loader from "../components/Loader";

export default function ResetPassword() {

    const [successMsg, setSuccessMsg] = useState(false);
    const [errors, setErrors] = useState(false);
    const { isLoggedIn, setIsLoading } = useContext(CommonContext);

    const params = useParams();
    const navi = useNavigate()

    const initialValues = {
        password: "",
        confirmPassword: ""
    }

    const validationSchema = Yup.object({
        password: Yup.string()
            .required('Required')
            .min(6, "minimum 6 characters")
            .max(100, "maximum 100 characters"),
        confirmPassword: Yup.string()
            .required('Required')
            .oneOf([Yup.ref('password'), null], "Password doesn't match!")
            .min(6, "minimum 6 characters")
            .max(100, "maximum 100 characters")
    });

    const onSubmit = ({ password }) => {

        const uploadToBackend = async () => {
            try {

                setIsLoading(true);

                const randomString = params.jwt;

                await axios.put(`/auth/resetpassword`, {
                    password,
                    randomString
                });

                setIsLoading(false);

                setSuccessMsg("Password updated please login to continue...");
            }
            catch (err) {
                setIsLoading(false);
                setErrors("Password reset link sent to your mail is expired/invalid.");
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
                    <div className="login">
                        {
                            successMsg ? (<div className="rpWrapper"><div className="registerErrorAlert">
                                <Alert variant="success">
                                    {successMsg}
                                </Alert>

                            </div>
                                {
                                    successMsg === "Password updated please login to continue..."
                                    && <Button onClick={() =>navi("/login")} className="skyBlueButton resetpassbtn">
                                        Login
                                    </Button>
                                }

                            </div>) :
                                <div className="loginBody">
                                    <div className="loginBodyTop">
                                        <div className="loginLogo">
                                            <span className="logoSVG"><FaStackOverflow /> </span>
                                            <span className="logoStack">reset</span>
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

                                            <Form.Group className="mb-3" controlId="formBasicConfirmPassword">
                                                <Form.Label>Confirm password</Form.Label>
                                                <Form.Control type="password" name="confirmPassword"
                                                    value={formik.values.confirmPassword} placeholder="Min 6 characters" onChange={formik.handleChange} onBlur={formik.handleBlur} />
                                                {
                                                    formik.errors.confirmPassword && formik.touched.confirmPassword ?
                                                        <Form.Text className="redErrors">
                                                            {formik.errors.confirmPassword}
                                                        </Form.Text> : null
                                                }
                                            </Form.Group>

                                            <Button className="skyBlueButton" type="submit">
                                                Change password
                                            </Button>
                                        </Form>

                                    </div>
                                </div>
                        }
                    </div>
                </Container>
            </Loader>
    )
}