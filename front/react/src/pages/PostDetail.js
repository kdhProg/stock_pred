import {useEffect, useState} from "react";
import {useNavigate, useParams} from "react-router-dom";
import axios from "axios";

const PostDetail = ()=>{

    const navigate = useNavigate();

    /* 요청용 필드 */
    const postId = useParams().postId;

    /* 로딩 */
    const [loading, setLoading] = useState(true);

    /* 게시글 response 받음 */
    const [post, setPost] = useState({});

    /* 게시글 단건 조회 */
    const getPost = async () => {
        const resp = await (await axios.get(`/post/${postId}`)).data;
        setPost(resp);
        setLoading(false);
    };


    /* 게시글 수정 */
    const updatePost = () => {
        navigate('/update/' + postId);
    };

    /* 게시글 삭제 */
    /*
    * Todo 게시글 삭제 시 글쓴이의 비밀번호 요구하기
    *
    * */
    const deletePost = async () => {
        if (window.confirm('게시글을 삭제하시겠습니까?')) {
            await axios.delete(`/post/${postId}`).then((res) => {
                alert('삭제되었습니다.');
                if(post.category === 0){navigate('/NoticePage');}
                else{navigate('/FreeBoardPage');}
            });
        }
    };

    /* 목록으로 복귀 - 카테고리기반 판단 */
    const moveToList = () => {
        if(post.category === 0){navigate('/NoticePage');}
        else{navigate('/FreeBoardPage');}
    };

    useEffect(() => {
        getPost();
    }, []);

    return(
        <div>
            {loading ? (
                <h2>loading...</h2>
            ) : (
                <div>
                <h2>제목: {post.title}</h2>
                <p>내용: {post.content}</p>
                <button onClick={updatePost}>수정</button>
                <button onClick={deletePost}>삭제</button>
                <button onClick={moveToList}>목록</button>
                </div>
            )}
        </div>
    )
}

export default PostDetail;