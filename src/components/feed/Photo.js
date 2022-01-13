import { gql, useMutation } from "@apollo/client";
import styled from "styled-components";
import { FatText } from "../shared";
import { Link } from "react-router-dom";
import Avatar from "../Avatar";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBookmark,
  faComment,
  faHeart,
  faPaperPlane,
} from "@fortawesome/free-regular-svg-icons";
import { faHeart as SolidHeart } from "@fortawesome/free-solid-svg-icons";
import PropTypes from "prop-types";
import Comments from "./Comments";

const TOGGLE_LIKE_MUTATION = gql`
  mutation ($id: Int!) {
    toggleLike(id: $id) {
      ok
      error
    }
  }
`;

const PhotoContainer = styled.div`
  background-color: white;
  border: 1px solid ${(props) => props.theme.borderColor};
  border-radius: 4px;
  margin-bottom: 60px;
  max-width: 615px;
`;
const PhotoHeader = styled.div`
  padding: 15px;
  display: flex;
  align-items: center;
  border-bottom: 1px solid rgb(239, 239, 239);
`;

const Username = styled(FatText)`
  margin-left: 15px;
`;

const PhotoFile = styled.img`
  width: 100%;
`;

const PhotoData = styled.div`
  padding: 10px 7px;
  margin-left: 10px;
`;

const PhotoActions = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;

  div {
    display: flex;
    align-items: center;
  }
  svg {
    font-size: 25px;
  }
`;

const PhotoAction = styled.div`
  cursor: pointer;
  margin-right: 15px;
`;

const Likes = styled(FatText)`
  display: block;
  margin-top: 5px;
`;

function Photo({
  id,
  user,
  file,
  isLiked,
  likeNum,
  caption,
  commentNum,
  comments,
}) {
  // Defing updateToggleLike
  const updateToggleLike = (cache, result) => {
    const {
      data: {
        toggleLike: { ok },
      },
    } = result;

    if (ok) {
      // Read Fragment
      const photoId = `Photo:${id}`;

      // New way of Cache Modifying (Apollo 3)
      cache.modify({
        id: photoId,
        fields: {
          isLiked(prev) {
            return !prev;
          },
          likeNum(prev) {
            if (isLiked) {
              return prev - 1;
            } else {
              return prev + 1;
            }
          },
        },
      });
    }
  };
  // End updateToggleLike

  // Use Mutation
  const [toggleLikeMutation] = useMutation(TOGGLE_LIKE_MUTATION, {
    variables: { id },
    update: updateToggleLike,
  });

  return (
    <PhotoContainer key={id}>
      <PhotoHeader>
        <Link to={`/users/${user.userName}`}>
          <Avatar lg={true} url={user.avatar} />
        </Link>
        <Link to={`/users/${user.userName}`}>
          <Username>{user.userName}</Username>
        </Link>
      </PhotoHeader>

      <PhotoFile src={file} />

      <PhotoData>
        <PhotoActions>
          <div>
            <PhotoAction onClick={toggleLikeMutation}>
              <FontAwesomeIcon
                style={{ color: isLiked ? "tomato" : "inherit" }}
                icon={isLiked ? SolidHeart : faHeart}
              />
            </PhotoAction>
            <PhotoAction>
              <FontAwesomeIcon icon={faComment} />
            </PhotoAction>
            <PhotoAction>
              <FontAwesomeIcon icon={faPaperPlane} />
            </PhotoAction>
          </div>
          <div>
            <PhotoAction>
              <FontAwesomeIcon icon={faBookmark} />
            </PhotoAction>
          </div>
        </PhotoActions>
        <Likes>{likeNum === 1 ? "1 like" : `${likeNum} likes`}</Likes>
        <Comments
          photoId={id}
          author={user.userName}
          caption={caption}
          commentNum={commentNum}
          comments={comments}
        />
      </PhotoData>
    </PhotoContainer>
  );
}

Photo.propTypes = {
  id: PropTypes.number.isRequired,
  user: PropTypes.shape({
    avatar: PropTypes.string,
    userName: PropTypes.string.isRequired,
  }),
  file: PropTypes.string.isRequired,
  isLiked: PropTypes.bool.isRequired,
  likeNum: PropTypes.number.isRequired,
  caption: PropTypes.string,
  commentNum: PropTypes.string.isRequired,
};

export default Photo;
