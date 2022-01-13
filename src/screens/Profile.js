import { gql, useApolloClient, useMutation, useQuery } from "@apollo/client";
import { faComment, faHeart } from "@fortawesome/free-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useParams } from "react-router-dom";
import styled from "styled-components";
import Button from "../components/auth/Button";
import PageTitle from "../components/PageTitle";
import { FatText } from "../components/shared";
import { PHOTO_FRAGMENT } from "../fragments";
import useUser from "../hooks/useUser";

const FOLLOW_USER_MUTATION = gql`
  mutation followUser($userName: String!) {
    followUser(userName: $userName) {
      ok
    }
  }
`;

const UNFOLLOW_USER_MUTATION = gql`
  mutation unfollowUser($userName: String!) {
    unfollowUser(userName: $userName) {
      ok
    }
  }
`;

const Header = styled.div`
  display: flex;
`;
const Avatar = styled.img`
  margin-left: 50px;
  height: 160px;
  width: 160px;
  border-radius: 50%;
  margin-right: 150px;
  background-color: #2c2c2c;
`;
const Column = styled.div``;
const Username = styled.h3`
  font-size: 28px;
  font-weight: 400;
`;
const Row = styled.div`
  margin-bottom: 20px;
  font-size: 16px;
  display: flex;
`;
const List = styled.ul`
  display: flex;
`;
const Item = styled.li`
  margin-right: 20px;
`;
const Value = styled(FatText)`
  font-size: 18px;
`;
const Name = styled(FatText)`
  font-size: 20px;
`;

const Grid = styled.div`
  display: grid;
  grid-auto-rows: 290px;
  grid-template-columns: repeat(3, 1fr);
  gap: 30px;
  margin-top: 50px;
`;

const Photo = styled.div`
  background-image: url(${(props) => props.bg});
  background-size: cover;
  position: relative;
`;

const Icons = styled.div`
  position: absolute;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  color: white;
  opacity: 0;
  &:hover {
    opacity: 1;
  }
`;

const Icon = styled.span`
  font-size: 18px;
  display: flex;
  align-items: center;
  margin: 0px 5px;
  svg {
    font-size: 14px;
    margin-right: 5px;
  }
`;

const SEE_PROFILE_QUERY = gql`
  # for front-end
  query seeProfile($userName: String!) {
    #for back-end
    seeProfile(userName: $userName) {
      firstName
      lastName
      userName
      bio
      avatar
      photos {
        ...PhotoFragment
      }
      totalFollowing
      totalFollowers
      isMe
      isFollowing
    }
  }
  ${PHOTO_FRAGMENT}
`;

const ProfileBtn = styled(Button).attrs({
  as: "span",
})`
  margin-left: 10px;
  margin-top: 0px;
  font-size: 14px;
  cursor: pointer;
`;

function Profile() {
  const { userName } = useParams(); // get url parameter
  const { data: userData } = useUser();
  const client = useApolloClient();
  const { data, loading } = useQuery(SEE_PROFILE_QUERY, {
    variables: { userName },
  });

  // UNFOLLOW USER update
  const unfollowUserUpdate = (cache, result) => {
    const {
      data: {
        unfollowUser: { ok },
      },
    } = result;

    if (!ok) {
      return;
    }

    // modify CACHE
    // 1. modify target user
    cache.modify({
      id: `User:${userName}`,
      fields: {
        isFollowing(prev) {
          return false;
        },
        totalFollowers(prev) {
          return prev - 1;
        },
      },
    });

    // 2. modify my Profile
    const { me } = userData;
    cache.modify({
      id: `User:${me.userName}`,
      fields: {
        totalFollowing(prev) {
          return prev - 1;
        },
      },
    });
  };

  // use Mutation
  const [unfollowUser] = useMutation(UNFOLLOW_USER_MUTATION, {
    variables: { userName },
    update: unfollowUserUpdate,
  });

  // FOLLOW USER UPDATE
  const followUserComplete = (data) => {
    const {
      followUser: { ok },
    } = data;

    if (!ok) {
      return;
    }

    // 1. CACHE modify target user
    const { cache } = client;
    cache.modify({
      id: `User:${userName}`,
      fields: {
        isFollowing(prev) {
          return true;
        },

        totalFollowers(prev) {
          return prev + 1;
        },
      },
    });

    // 2. CACHE modify ME
    const { me } = useUser;
    cache.modify({
      id: `User:${me?.userName}`,
      fields: {
        totalFollowing(prev) {
          return prev + 1;
        },
      },
    });
  };

  // use Mutation
  const [followUser] = useMutation(FOLLOW_USER_MUTATION, {
    variables: { userName },
    onCompleted: followUserComplete,
  });

  // User Status(Relation)에 따라 다른 Btn 제공
  const getButton = (seeProfile) => {
    const { isMe, isFollowing } = seeProfile;

    if (isMe) {
      return <ProfileBtn>Edit Profile</ProfileBtn>;
    } else if (isFollowing) {
      return <ProfileBtn onClick={unfollowUser}>Unfollow</ProfileBtn>;
    } else {
      return <ProfileBtn onClick={followUser}>Follow</ProfileBtn>;
    }
  };

  return (
    <div>
      <PageTitle
        title={loading ? "Loading..." : `${data?.seeProfile?.userName}`}
      />
      <Header>
        <Avatar src={data?.seeProfile?.avatar} />
        <Column>
          <Row>
            <Username>{data?.seeProfile?.userName}</Username>
            {data?.seeProfile ? getButton(data.seeProfile) : null}
          </Row>
          <Row>
            <List>
              <Item>
                <span>
                  <Value>{data?.seeProfile?.totalFollowers}</Value> followers
                </span>
              </Item>
              <Item>
                <span>
                  <Value>{data?.seeProfile?.totalFollowing}</Value> following
                </span>
              </Item>
            </List>
          </Row>
          <Row>
            <Name>
              {data?.seeProfile?.firstName}
              {"  "}
              {data?.seeProfile?.lastName}
            </Name>
          </Row>
          <Row>{data?.seeProfile?.bio}</Row>
        </Column>
      </Header>
      <Grid>
        {data?.seeProfile?.photos.map((photo) => (
          <Photo key={photo.id} bg={photo.file}>
            <Icons>
              <Icon>
                <FontAwesomeIcon icon={faHeart} />
                {photo.likeNum}
              </Icon>
              <Icon>
                <FontAwesomeIcon icon={faComment} />
                {photo.commentNum}
              </Icon>
            </Icons>
          </Photo>
        ))}
      </Grid>
    </div>
  );
}

export default Profile;
