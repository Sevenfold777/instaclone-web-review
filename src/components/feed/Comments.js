import { gql, useMutation } from "@apollo/client";
import { useForm } from "react-hook-form";
import styled from "styled-components";
import useUser from "../../hooks/useUser";
import Comment from "./Comment";
import PropTypes from "prop-types";

const CREATE_COMMENT_MUTATION = gql`
  mutation ($photoId: Int!, $payload: String!) {
    createComment(photoId: $photoId, payload: $payload) {
      ok
      id
      error
    }
  }
`;

const CommentsContainer = styled.div`
  margin-top: 7px;
`;

const CommentCount = styled.span`
  opacity: 0.7;
  margin: 10px 0px;
  display: block;
  font-size: 12px;
  font-weight: 600;
`;

const PostCommentContainer = styled.div`
  margin-top: 10px;
  padding-top: 15px;
  padding-bottom: 10px;
  border-top: 1px solid ${(props) => props.theme.borderColor};
`;

const PostCommentInput = styled.input`
  width: 100%;
  &::placeholder {
    font-size: 12px;
  }
`;

// &:, &:: 확인

// Comment: { commentId, photoId, author, payload, isMine }
function Comments({ photoId, author, caption, commentNum, comments }) {
  // find current user
  const { data: userData } = useUser();

  // useForm
  const { register, handleSubmit, setValue, getValues } = useForm();

  // when createComment, update CACHE (apollo)
  const createCommentUpdate = (cache, result) => {
    const {
      data: {
        createComment: { ok, id },
      },
    } = result;

    // userData.me는 왜 필요한지
    if (ok && userData.me) {
      const { payload } = getValues();
      setValue("payload", "");

      // generate new cache with the valid FORM
      const newComment = {
        __typename: "Comment",
        createdAt: Date.now() + "",
        id,
        isMine: true,
        payload,
        user: { ...userData.me },
      };

      // create REAL cache fragment
      const newCacheComment = cache.writeFragment({
        data: newComment,
        fragment: gql`
          fragment temp on Comment {
            id
            createdAt
            isMine
            payload
            user {
              userName
              avatar
            }
          }
        `,
      });

      // cache modify
      cache.modify({
        id: `Photo:${photoId}`,
        fields: {
          comments(prev) {
            return [...prev, newCacheComment];
          },
          commentNum(prev) {
            return prev + 1;
          },
        },
      });
    }
  };

  // use mutation
  const [createComment, { loading }] = useMutation(CREATE_COMMENT_MUTATION, {
    update: createCommentUpdate,
  });

  // execute mutation
  const onSubmitComment = (data) => {
    const { payload } = data;
    if (loading) {
      // loading 처리 (return none)
      return;
    }

    createComment({ variables: { photoId, payload } });
  };

  // return
  return (
    <CommentsContainer>
      <Comment author={author} payload={caption} />
      <CommentCount>
        {commentNum === 1 ? "1 comment" : `${commentNum} comments`}
      </CommentCount>

      {comments?.map((comment) => (
        <Comment
          key={comment.commentId}
          commentId={comment.commentId}
          author={comment.user.userName}
          payload={comment.payload}
          isMine={comment.isMine}
          photoId={photoId}
        />
      ))}

      <PostCommentContainer>
        <form onSubmit={handleSubmit(onSubmitComment)}>
          <PostCommentInput
            {...register("payload", { required: true })}
            type="text"
            placeholder="Write a Comment"
          />
        </form>
      </PostCommentContainer>
    </CommentsContainer>
  );
}

//{ photoId, author, caption, commentNum, comments }
Comments.propTypes = {
  photoId: PropTypes.number.isRequired,
  author: PropTypes.string.isRequired,
  caption: PropTypes.string,
  commentNum: PropTypes.number.isRequired,
  comments: PropTypes.arrayOf(
    PropTypes.shape({
      commentId: PropTypes.number.isRequired,
      user: PropTypes.shape({
        avatar: PropTypes.string,
        userName: PropTypes.string.isRequired,
      }).isRequired,
      payload: PropTypes.string.isRequired,
      isMine: PropTypes.bool.isRequired,
      createdAt: PropTypes.string.isRequired,
    })
  ),
};

export default Comments;
