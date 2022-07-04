import { Container, Form, Button } from 'react-bootstrap';
import { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import { useFormik } from 'formik';
import * as Yup from "yup";
import Loader from '../components/Loader';
import CommonContext from '../context/CommonContext';
import { toast } from 'react-toastify';

export default function UpdateQuestion() {

    const [question, setQuestion] = useState();

    const { setIsLoading } = useContext(CommonContext);


    const navi = useNavigate();
    const params = useParams()

    useEffect(() => {

        const getQuestion = async () => {
            try {
                setIsLoading(true);
                const { data } = await axios.put(`/questions/get/${params.id}`);
                setQuestion(data);
                setIsLoading(false);

            }
            catch (err) {
                setIsLoading(false);
                console.error(err);
                toast.error("Error fetching question data from server!");
            }
        }

        getQuestion();

    }, [params.id, setIsLoading]);

    const initialValues = {
        title: question?.title || "",
        body: question?.body || "",
        tags: question?.tags || []
    };

    Yup.addMethod(Yup.array, 'unique', function (message) {
        return this.test('unique', message, function (list) {
            return list.filter(e => e !== undefined).length ===
                new Set(list.filter(e => e !== undefined).map(e => e?.toLowerCase())).size;
        });
    });

    Yup.addMethod(Yup.string, 'noSpaces', function (message) {
        return this.test('noSpaces', message, function (s) {
            return !s?.includes(" ");
        });
    });

    const validationSchema = Yup.object({
        title: Yup.string()
            .min(3, "minimum 3 characters")
            .max(100, "maximum 100 characters")
            .required('required'),
        body: Yup.string()
            .min(5, "minimum 5 characters")
            .max(5000, "maximum 5000 characters")
            .required('required'),
        tags: Yup.array().of(Yup.string().max(15, "maximum 15 characters")
            .noSpaces("no spaces allowed in-between a tag! "))
            .unique("tag must be unique")

    });
    const onSubmit = ({ title, body, tags: oldtags }) => {

        // api call to update user
        const uploadToBackend = async () => {
            try {
                setIsLoading(true);

                const tags = oldtags.filter(t => t.length !== 0);

                await axios.put(`/questions/update/${params.id}`, { title, body, tags },
                    {
                        headers: { "token": localStorage.getItem("token") }
                    });
                setIsLoading(false);

                navi(`/questions/${params.id}`);

            }
            catch (err) {
                setIsLoading(false);
                toast.error("Couldnt update question. Try later...");
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
                    <h2>Update question</h2>

                </div>

                <div className="askQuestionBottom">

                    <Form onSubmit={formik.handleSubmit} >

                        <Form.Group className="mb-3" controlId="formBasicText">
                            <Form.Label>Title</Form.Label>
                            <Form.Control type="text" name="title"
                                value={formik.values.title} placeholder="Enter question title"
                                onChange={formik.handleChange} onBlur={formik.handleBlur} />
                            {
                                formik.errors.title && formik.touched.title ?
                                    <Form.Text className="redErrors">
                                        {formik.errors.title}
                                    </Form.Text> : null
                            }

                        </Form.Group>
                        <Form.Group className="mb-3" controlId="formBasicUn">
                            <Form.Label>Body</Form.Label>
                            <Form.Control as="textarea" rows={6} name="body"
                                value={formik.values.body} placeholder="Enter question body"
                                onChange={formik.handleChange} onBlur={formik.handleBlur} />
                            {
                                formik.errors.body && formik.touched.body ?
                                    <Form.Text className="redErrors">
                                        {formik.errors.body}
                                    </Form.Text> : null
                            }

                        </Form.Group>

                        <Form.Group className="mb-3" controlId="formBasicBio">
                            <Form.Label>Tags <span className='tagSlog'>(optional but helpful)</span></Form.Label>
                            <div className="tagsInputDiv">

                                <Form.Control type="text" name="tags.0" value={formik.values.tags[0] || ""}
                                    placeholder="tag name"
                                    onChange={formik.handleChange} onBlur={formik.handleBlur}
                                />
                                <Form.Control type="text" name="tags.1" value={formik.values.tags[1] || ""}
                                    placeholder="tag name"
                                    onChange={formik.handleChange} onBlur={formik.handleBlur}
                                />
                                <Form.Control type="text" name="tags.2" value={formik.values.tags[2] || ""}
                                    placeholder="tag name"
                                    onChange={formik.handleChange} onBlur={formik.handleBlur}
                                />
                                <Form.Control type="text" name="tags.3" value={formik.values.tags[3] || ""}
                                    placeholder="tag name"
                                    onChange={formik.handleChange} onBlur={formik.handleBlur}
                                />
                                <Form.Control type="text" name="tags.4" value={formik.values.tags[4] || ""}
                                    placeholder="tag name"
                                    onChange={formik.handleChange} onBlur={formik.handleBlur}
                                />

                            </div>

                            {
                                formik.errors.tags ?
                                    <Form.Text className="redErrors">
                                        {formik.errors.tags}
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