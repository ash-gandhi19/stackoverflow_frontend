import { Container, Button, Alert } from 'react-bootstrap';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { useState, useEffect, useContext } from 'react';
import Question from '../components/Question';
import CommonContext from '../context/CommonContext';
import moment from 'moment';
import Loader from '../components/Loader';
import { toast } from 'react-toastify';

export default function Profile() {

    const { SetIsLoggedIn, setIsLoading } = useContext(CommonContext);

    const [user, setUser] = useState();

    const [QAToggle, setQAToggle] = useState(true);
    const handleQuestionsShow = () => setQAToggle(true);
    const handleAnswersShow = () => setQAToggle(false);

    const navi = useNavigate();

    //logout operation
    const logoutOperation = () => {
        localStorage.clear();
        SetIsLoggedIn(false);
    }

    const gotoQuestion = (id) => {
        navi(`/questions/${id}`);
    }

    useEffect(() => {

        //api call to get user info
        const getUser = async () => {

            try {

                setIsLoading(true);
                const token = localStorage.getItem("token");
                const { data } = await axios.get(`/users/profile`,
                    { headers: { "token": token } }
                );
                setUser(data);
                setIsLoading(false);

            }
            catch (err) {
                setIsLoading(false);
                toast.error("Error fetching data from server! Refresh page or come back later.");
                console.error(err);
            }
        }

        getUser();

    }, [setIsLoading]);

    return <Loader>
        <Container>
            {
                <div className="profileWrapper" >

                    <div className="profileTop">
                        <div className="profileTopLeft">
                            <img src={user?.profilePicture} alt="profile pic" className="profileImg" />

                        </div>
                        <div className="profileTopRight">
                            <div className="profileTopRightTop">
                                <span className="profileUsername">{user?.userName}</span>
                                <Link to="/profile/edit">
                                    <Button className="skyBlueButton" >Edit profile</Button>
                                </Link>
                                <div className="logoutDiv">
                                    <Button variant="outline-danger"
                                        onClick={logoutOperation}
                                    >Logout</Button>
                                </div>

                            </div>
                            <div className="profileTopRightMiddle">
                                <span onClick={handleQuestionsShow}
                                    className={!QAToggle ? "userDetailsCountSpan" : ""}
                                >
                                    <span className="profileTopRightMiddleData">{user?.userQuestions?.length}</span> questions
                                </span>
                                <span onClick={handleAnswersShow}
                                    className={QAToggle ? "userDetailsCountSpan" : ""}
                                ><span className="profileTopRightMiddleData">{user?.userAnswers?.length}</span> answers</span>
                            </div>
                            <div className="profileTopRightBottom">
                                <p className="profilebio" >{user?.fullName}</p>
                                <p>Member since {(new Date(user?.createdAt)).toDateString()}</p>
                            </div>
                        </div>
                    </div>
                    <div className="profileEducation">
                        <p className="userInfoPara">
                            <span className="uiBold">Qualification</span> -
                            {" " + user?.qualification}
                        </p>
                        <p className="userInfoPara">
                            <span className="uiBold">Experience</span> -
                            {" " + user?.yearsOfExperience}
                        </p>
                        <p className="userInfoPara">
                            <span className="uiBold">Passing year</span> -
                            {" " + user?.yearOfPassing}
                        </p>
                    </div>
                    <div className="profileMiddle">
                        <ul className="profileMiddleList">
                            <li className="profileMiddleListItem">
                                <button
                                    onClick={handleQuestionsShow}
                                    className={QAToggle ?
                                        "profileMiddleListItemBtn qatoggle" :
                                        "profileMiddleListItemBtn"}>
                                    Questions
                                </button>
                            </li>
                            <li className="profileMiddleListItem">
                                <button onClick={handleAnswersShow}
                                    className={QAToggle ?
                                        "profileMiddleListItemBtn" :
                                        "profileMiddleListItemBtn qatoggle"}>
                                    Answers
                                </button>
                            </li>
                            <li className="profileMiddleListItem">
                                <Link to="/questions/ask">
                                    <button className="profileMiddleListItemBtn">Ask Question</button>
                                </Link>

                            </li>
                        </ul>
                    </div>
                    <div className="profileBottom" >
                        {
                            QAToggle && (user?.userQuestions?.length === 0) && <Alert
                                className="errorAlert"
                                variant="primary">
                                You didn't ask any questions yet...
                            </Alert>
                        }
                        {
                            !QAToggle && (user?.userAnswers?.length === 0) && <Alert
                                className="errorAlert"
                                variant="primary">
                                You didn't answer any questions yet...
                            </Alert>
                        }
                        {
                            QAToggle && user?.userQuestions?.map(q => <Question key={q._id} q={q} />)
                        }
                        {
                            !QAToggle && user?.userAnswers?.map(a => <div className="profileAnswerBody" key={a._id}>
                                <div className="profileAnswerBodyLeft ">
                                    <div className="questionStatsList">
                                        <div className="questionStatsItem"
                                            onClick={() => gotoQuestion(a.questionId)}>
                                            <div className="statsNumberDiv">
                                                <span className="statsNumber">
                                                    {a.votes}
                                                </span>
                                            </div>
                                            <div className="statsNameDiv">
                                                <span className="statsName">votes</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="profileAnswerBodyRight">
                                    <p className="profileAnswerTitle"
                                        onClick={() => gotoQuestion(a.questionId)}>
                                        {a.title}
                                    </p>
                                    <p className="profileAnswerBodyText">
                                        {a.body.split(" ").slice(0, 30).join(" ")}
                                        {a.body.length > a.body.split(" ").slice(0, 30).join(" ").length &&
                                            <span className='readMoreSpan'
                                                onClick={() => gotoQuestion(a.questionId)}> read more...</span>}
                                    </p>
                                    <div className="userAndTimeDiv">
                                        <p className="userAndTimePara"
                                            onClick={() => gotoQuestion(a.questionId)}>
                                            Asked by <span className="userNameSpan">{a.userId.userName + " "}</span>
                                            on {moment(a.createdAt).format("DD MMM YYYY hh:mm a")}
                                        </p>
                                    </div>
                                </div>
                            </div>)
                        }
                    </div>
                </div>
            }
        </Container>
    </Loader>
}