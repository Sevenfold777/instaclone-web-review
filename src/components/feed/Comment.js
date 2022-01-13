import { gql, useMutation } from "@apollo/client";
import React from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";
import { FatText } from "../shared";
import PropTypes from "prop-types";

/* MUTAION gql */
const DELETE_COMMMENT_MUTATION = gql`
  mutation ($commentId: Int!) {
    deleteComment(commentId: $commentId) {
      ok
      error
    }
  }
`;

const CommentContainer = styled.div``;
const CommentCaption = styled.span`
  margin-left: 10px;
  a {
    background-color: inherit;
    color: ${(props) => props.theme.accent};
    cursor: pointer;
    &:hover {
      text-decoration: underline;
    }
  }
`;

const CommentDeleteBtn = styled.button`
  padding: 0px;
  max-width: 10px;
  width: 100%;
  border: 0.5px solid ${(props) => props.theme.borderColor};
  border-radius: 3px;
  background-color: ${(props) => props.theme.bgColor};
  color: ${(props) => props.theme.borderColor};
  font-size: 5px;
  &:hover {
    background-color: ${(props) => props.theme.borderColor};
    color: ${(props) => props.theme.textColor};
  }
`;

function Comment({ commentId, photoId, author, payload, isMine }) {
  // update commentDelete
  const updateDeleteComment = (cache, result) => {
    const {
      data: {
        deleteComment: { ok },
      },
    } = result;

    if (ok) {
      cache.evict({ id: `Comment:${commentId}` }); // remove Cache (Apollo)
      cache.modify({
        // find the photo with photoId
        id: `Photo:${photoId}`,
        // num of comments --
        fields: {
          commentNum(prev) {
            return prev - 1;
          },
        },
      });
    }
  };

  // use Mutation
  const [deleteComment] = useMutation(DELETE_COMMMENT_MUTATION, {
    variables: { commentId },
    update: updateDeleteComment, // update: a function used to update the Apollo Client CACHE after the mutation completes
  });

  // mutation execution
  const onDeleteClicked = () => {
    deleteComment();
  };

  //////// React.Fragment 및 Link 공부 필요
  return (
    <CommentContainer>
      <Link to={`/users/${author}`}>
        <FatText>{author}</FatText>
      </Link>

      <CommentCaption>
        {payload.split(" ").map((word, index) =>
          /#[\w]+/.test(word) ? (
            <React.Fragment key={index}>
              <Link key={index} to={`/hashtags/${word}`}>
                {word}
              </Link>{" "}
            </React.Fragment>
          ) : (
            <React.Fragment key={index}>{word}</React.Fragment>
          )
        )}
      </CommentCaption>

      {isMine ? (
        <CommentDeleteBtn onClick={onDeleteClicked}>x</CommentDeleteBtn>
      ) : null}
    </CommentContainer>
  );
}

// { commentId, photoId, author, payload, isMine }
//// 왜 어떤 props는 propTypes하고 어떤 것은 안하는지
Comment.propTypes = {
  commentId: PropTypes.number,
  photoId: PropTypes.number,
  author: PropTypes.string.isRequired,
  payload: PropTypes.string.isRequired,
  isMine: PropTypes.bool,
};

export default Comment;
