import { useContext, useEffect, useRef, useState } from 'react';
import { Button, Container } from 'react-bootstrap';
import axios from 'axios';
import { Link, useParams } from 'react-router-dom';
import moment from 'moment';
import { AiFillCaretDown, AiFillDelete } from "react-icons/ai";
import { useNavigate } from 'react-router-dom';
import CreateAnswerModal from '../components/CreateAnswerModal';
import CreateCommentModal from '../components/CreateCommentModal';
import Answer from '../components/Answer';
import Comment from '../components/Comment';
import { FaRegEdit, FaSpinner } from 'react-icons/fa';
import DeleteQuestionModal from '../components/DeleteQuestionModal';
import CommonContext from '../context/CommonContext';
import { toast } from 'react-toastify';
import Loader from '../components/Loader';

export default function ViewQuestion(props) {

const isLoggedIn=props.value;
    const [question, setQuestion] = useState();
    const [answers, setAnswers] = useState([]);
    const { setIsLoading } = useContext(CommonContext);
    const [isVoting, setIsVoting] = useState(false);

    const params = useParams();
    const navi = useNavigate();
    const token = localStorage.getItem("token");
    const userId = localStorage.getItem("id");

    const commentRef = useRef();

    const [showAddComment, setShowAddComment] = useState(false);

    const goToLogin = () => {
        navi("/login");
    }

    const goToUpdateQuestion = () => {
        navi(`/questions/update/${params.id}`);
    }

    const handleAddCommentShow = async() => {
        if (!isLoggedIn) goToLogin()
        else {
            setShowAddComment(true);
        }

    }

    const [showAddAnswer, setShowAddAnswer] = useState(false);

    const handleAddAnswerShow = async() => {
        if (!isLoggedIn) goToLogin()
        else {
            setShowAddAnswer(true);
        }

    }


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
                toast.error("Error fetching question from server! Refresh page or come back later.");
            }

        }

        getQuestion();


    }, [params.id, setIsLoading]);

    useEffect(() => {

        const getAnswers = async () => {
            try {
                setIsLoading(true);
                const { data } = await axios.get(`/answers/ofquestion/${params.id}`);
                setAnswers(data);
                setIsLoading(false);

            }
            catch (err) {
                setIsLoading(false);
                console.error(err);
                toast.error("Error fetching answers from server! Refresh page or come back later.");
            }

        }

        getAnswers();


    }, [params.id, setIsLoading]);

    const gotoTag = (tag) => {
        navi(`/tags/${tag}`);
    }

    const voteQuestion = async (vote) => {

        if (!isLoggedIn) goToLogin()
        else {
            try {
                setIsVoting(true);
                const { data } = await axios.put(`/questions/vote/${params.id}`, {
                    vote
                }, {
                    headers: { "token": token }
                });
                setQuestion(data);
                setIsVoting(false);
            }
            catch (err) {
                setIsVoting(false);
                console.error(err);
                toast.error("Error voting question !");
            }
        }
    }

    const [showDeleteQuestion, setShowDeleteQuestion] = useState(false);
    const handleDeleteQuestionShow = () => setShowDeleteQuestion(true);

    return <Loader>
        <Container>
            <div className="questionsWrapper">
                <div className="questionsTopBody">
                    <div className="questionsTopTop">
                        <h2>{question?.title}</h2>
                        <Link to="/questions/ask">
                            <Button className="skyBlueButton">Ask Question</Button>
                        </Link>

                    </div>
                    <div className="questionMetaDataDiv">
                        <p className="questionMetaData">Asked <span className="uiBold">{moment(question?.createdAt).fromNow()}</span>  </p>
                        <p className="questionMetaData">By <span className="uiBold"> {question?.userId.userName}</span> </p>
                        <p className="questionMetaData">Viewed <span className="uiBold">{question?.views} times</span>  </p>
                        <p className="questionMetaData">Created <span className="uiBold">{
                            (new Date(question?.createdAt)).toDateString()}</span>  </p>
                        <p className="questionMetaData">
                            {
                                question?.userId._id === userId &&
                                <span className="questionActionsDiv">
                                    <span className="questionAction">
                                        <FaRegEdit onClick={goToUpdateQuestion} />
                                    </span>
                                    <span className="questionAction deleteIcon">
                                        <AiFillDelete
                                            onClick={() => handleDeleteQuestionShow(question._id)} />
                                    </span>
                                </span>
                            }
                        </p>
                    </div>
                </div>

                <div className="questionBodyDiv">

                    <div className="questionBodyLeft">
                        <div className="voteBody">

                            <span className={question?.upVotes.find(v => v === userId) ?
                                "upVote votedStyle" : "upVote"}
                                onClick={() => voteQuestion("up")}
                            ><AiFillCaretDown /></span>

                            <span className="votesCount">
                                {isVoting ? <FaSpinner /> : question?.votes}
                            </span>

                            <span className={question?.downVotes.find(v => v === userId) ?
                                "downVote votedStyle" : "downVote"}
                                onClick={() => voteQuestion("down")}
                            ><AiFillCaretDown /></span>
                        </div>
                    </div>
                    <div className="questionBodyRight">
                        <p className="questionsBody">
                            {question?.body}
                        </p>
                        <div className="tagsDiv">
                            <ul className="tagsList">
                                {
                                    question?.tags.map(t =>
                                        <li key={t}
                                            className="tagsItem"
                                            onClick={() => gotoTag(t)}>
                                            <span className="tagName">{t}</span>
                                        </li>
                                    )
                                }
                            </ul>

                        </div>
                    </div>


                </div>

                <div className="commentsContainer">
                    <div className="commentTop">
                        <h4 className="commentsTitle">
                            <span className="uiBold">{question?.comments.length}</span> comments
                        </h4>

                        <p className="addCommentPara" onClick={handleAddCommentShow}>Add a comment</p>

                    </div>

                    <div className="commentsBody" >
                        {
                            question?.comments.map(c =>
                                <Comment
                                    key={c._id}
                                    comment={c}
                                    commentRef={commentRef}
                                    question={question}
                                    setQuestion={setQuestion}
                                />
                            )
                        }
                    </div>
                </div>
                <div className="answersContainer">
                    <div className="answersTop">
                        <h4 className="answersTitle">
                            <span className="uiBold">{answers?.length}</span> answers
                        </h4>

                        <p className="addAnswerPara" onClick={handleAddAnswerShow}>Add an answer</p>

                    </div>

                    <div className="answersList">
                        {
                            answers?.map(a =>
                                <Answer
                                    key={a._id}
                                    answer={a}
                                    answers={answers}
                                    setAnswers={setAnswers}
                                />
                            )
                        }
                    </div>

                </div>
            </div>

            {/* Delete question warning */}
            <DeleteQuestionModal
                questionId={params.id}
                showDeleteQuestion={showDeleteQuestion}
                setShowDeleteQuestion={setShowDeleteQuestion}
            />

            {/* Add comment form  */}
            <CreateCommentModal
                setQuestion={setQuestion}
                showAddComment={showAddComment}
                setShowAddComment={setShowAddComment}
                questionId={params.id}
                commentRef={commentRef}
            />

            {/* Add Answer form  */}
            <CreateAnswerModal
                answers={answers}
                setAnswers={setAnswers}
                showAddAnswer={showAddAnswer}
                setShowAddAnswer={setShowAddAnswer}
                questionId={params.id}
            />

        </Container>
    </Loader>
}