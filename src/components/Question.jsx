import React from 'react';
import { useNavigate, useParams ,useLocation} from "react-router-dom";
import moment from "moment";


export default function Question({ q }) {

    const navi = useNavigate();
    const params = useParams();
    const location = useLocation();
    const gotoQuestion = (id) => {
        navi(`/questions/${id}`);
    }

    const gotoTag = (tag) => {
        navi(`/tags/${tag}`);
    }

    return (
        <div key={q._id} className="questionContainer">
            <div className="questionContainerLeft">
                <ul className="questionStatsList" onClick={() => gotoQuestion(q._id)}>
                    <li className="questionStatsItem">
                        <div className="statsNumberDiv">
                            <span className="statsNumber">
                                {q.votes}
                            </span>
                        </div>
                        <div className="statsNameDiv">
                            <span className="statsName">votes</span>
                        </div>
                    </li>
                    <li className="questionStatsItem answerStat">
                        <div className="statsNumberDiv">
                            <span className="statsNumber">
                                {q.answers.length}
                            </span>
                        </div> 
                        <div className="statsNameDiv ">
                            <span className="statsName">answers</span>
                        </div>
                    </li>
                    <li className="questionStatsItem">
                        <div className="statsNumberDiv">
                            <span className="statsNumber">
                                {q.views}
                            </span>
                        </div>
                        <div className="statsNameDiv">
                            <span className="statsName">views</span>
                        </div>
                    </li>
                </ul>

            </div>
            <div className="questionContainerRight">
                <p className="questionTitle" onClick={() => gotoQuestion(q._id)}>
                    {q.title}
                </p>

                {
                    location.pathname === "/" ? null : <p className="questionBody">
                        {q.body.split(" ").slice(0, 30).join(" ")}
                        {q.body.length > q.body.split(" ").slice(0, 30).join(" ").length &&
                            <span className='readMoreSpan'
                                onClick={() => gotoQuestion(q._id)}> read more...</span>}</p>
                }


                <div className="tagsDiv">
                    <ul className="tagsList">
                        {
                            q.tags.map(t => <li key={t}
                                className={params.tag === t ? "currentTag" : "tagsItem"}
                                onClick={() => gotoTag(t)}>
                                <span className="tagName">{t}</span>
                            </li>)
                        }
                    </ul>

                </div>
                <div className="userAndTimeDiv">
                    <p className="userAndTimePara" onClick={() => gotoQuestion(q._id)}>
                        Asked by <span className="userNameSpan">{q.userId.userName + " "}</span>
                        on {moment(q.createdAt).format("DD MMM YYYY hh:mm a")}
                    </p>
                </div>
            </div>
        </div>
    )
}