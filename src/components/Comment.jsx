import React, { useState } from 'react';
import moment from 'moment';
import { AiFillDelete } from "react-icons/ai";
import DeleteCommentModal from './DeleteCommentModal';

export default function Comment({ comment, commentRef, question, setQuestion }) {

    const userId = localStorage.getItem("id");

    const [showDeleteComment, setShowDeleteComment] = useState(false);
    const [deleteCommentId, setDeleteCommentId] = useState();

    const handleDeleteCommentShow = (cid) => {
        setDeleteCommentId(cid);
        setShowDeleteComment(true);
    }

    return <>
        <p ref={commentRef} className="commentPara" >
            <span className="commentText">
                {comment.comment}
                <span className="commentByAndDate">
                    - {comment.userId.userName}, {moment(comment.createdAt).format('DD MMM YYYY hh:mm a')}
                </span>
            </span>
            <span className="deleteIcon"
                onClick={() => handleDeleteCommentShow(comment._id)}>
                {comment.userId._id === userId && <AiFillDelete />}
            </span>
        </p>


        {/* Warning before deleting a comment */}
        <DeleteCommentModal
            question={question}
            setQuestion={setQuestion}
            showDeleteComment={showDeleteComment}
            setShowDeleteComment={setShowDeleteComment}
            deleteCommentId={deleteCommentId}
        />
    </>
}