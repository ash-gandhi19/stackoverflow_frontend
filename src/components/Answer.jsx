import React, { useContext, useState } from 'react';
import moment from 'moment';
import { FaRegEdit, FaSpinner } from 'react-icons/fa';
import { AiFillCaretDown, AiFillDelete } from "react-icons/ai";
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import CommonContext from "../context/CommonContext";
import DeleteAnswerModal from './DeleteAnswerModal';
import UpdateAnswerModal from './UpdateAnswerModal';
import { toast } from 'react-toastify';


export default function Answer({ answer, answers, setAnswers }) {

    const userId = localStorage.getItem("id");
    const navi = useNavigate();
    const { isLoggedIn } = useContext(CommonContext);
    const [isVoting, setIsVoting] = useState(false);

    const [showDeleteAnswer, setShowDeleteAnswer] = useState(false);
    const [deleteAnswerId, setDeleteAnswerId] = useState();

    const handleDeleteAnswerShow = (id) => {
        setDeleteAnswerId(id);
        setShowDeleteAnswer(true);
    }

    const [showUpdateAnswer, setShowUpdateAnswer] = useState(false);
    const [updateAnswer, setUpdateAnswer] = useState();

    const handleUpdateAnswerShow = (answer) => {
        setUpdateAnswer(answer);
        setShowUpdateAnswer(true);
    }

    const voteAnswer = async (vote, id) => {

        if (!isLoggedIn) navi("/login")
        else {
            try {
                setIsVoting(true);
                const { data } = await axios.put(`/answers/vote`, {
                    vote,
                    answerId: id
                }, {
                    headers: { "token": localStorage.getItem("token") }
                });
                const newAnswers = answers;
                newAnswers[newAnswers.findIndex(a => a._id === id)] = data;
                setAnswers([...newAnswers]);
                setIsVoting(false);
            }
            catch (err) {
                setIsVoting(false);
                console.error(err);
                toast.error("Error voting answer!");
            }
        }
    }

    return (<div className="answerBodyDiv">
        <div className="answerBodyLeft">
            <div className="voteBody">

                <span className={answer.upVotes.find(v => v === userId) ?
                    "upVote votedStyle" : "upVote"}
                    onClick={() => voteAnswer("up", answer._id)}
                ><AiFillCaretDown /></span>

                <span className="votesCount">
                    {isVoting ? <FaSpinner /> : answer.votes}
                </span>

                <span className={answer.downVotes.find(v => v === userId) ?
                    "downVote votedStyle" : "downVote"}
                    onClick={() => voteAnswer("down", answer._id)}
                ><AiFillCaretDown /></span>
            </div>
        </div>

        <div className="answerBodyRight">
            <p className="answerTitle" >
                <span>
                    {answer.title}
                </span>

                {
                    answer.userId._id === userId &&
                    <span className="answerActionsDiv">
                        <span className="answerAction">
                            <FaRegEdit
                                onClick={() => handleUpdateAnswerShow(answer)}
                            />
                        </span>
                        <span className="answerAction deleteIcon">
                            <AiFillDelete
                                onClick={() => handleDeleteAnswerShow(answer._id)} />
                        </span>
                    </span>
                }


            </p>

            <p className="answerBody">
                {answer.body}
            </p>

            <div className="userAndTimeDivAnswer">
                <p className="userAndTimeParaAnswer">
                    Answered by <span className="userNameSpan">{answer.userId.userName + " "}</span>
                    on {moment(answer.createdAt).format("DD MMM YYYY hh:mm a")}
                </p>
            </div>

        </div>

        {/* Warning before deleting an answer */}
        <DeleteAnswerModal
            answers={answers}
            setAnswers={setAnswers}
            deleteAnswerId={deleteAnswerId}
            showDeleteAnswer={showDeleteAnswer}
            setShowDeleteAnswer={setShowDeleteAnswer}
        />


        {/* Update Answer form  */}
        <UpdateAnswerModal
            answers={answers}
            setAnswers={setAnswers}
            updateAnswer={updateAnswer}
            showUpdateAnswer={showUpdateAnswer}
            setShowUpdateAnswer={setShowUpdateAnswer}
        />

    </div>)
}