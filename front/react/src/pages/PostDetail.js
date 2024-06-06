import {useEffect, useState} from "react";
import {useNavigate, useParams} from "react-router-dom";
import axios from "axios";
import "../css/PostDetail.css"
import Button from "react-bootstrap/Button";

const PostDetail = ()=>{
    
    /*
    * 
    * Todo 수정 / 삭제는 글쓴이 본인만 가능하도록 -> 관리자는 always삭제 가능
    * 
    * */

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
        <div className="postDetailContainer">
            {loading ? (
                <h2>loading...</h2>
            ) : (
                <div>
                    <br/><br/>
                    <div className="titleRow">
                        <div className="titleInfo">
                            <h4><b>제목</b></h4>
                        </div>
                        <div className="titleValueBoxWrapper">
                            <input className="titleValueBox" type="text" value={post.title} readOnly={true}/>
                        </div>
                    </div>
                    <div className="contentRow">
                        <div className="contentInfo">
                            <h4><b>내용</b></h4>
                        </div>
                        <div className="contentValueBoxWrapper">
                            <textarea className="contentValueBox" value={post.content}></textarea>
                        </div>
                    </div>
                    <div className="buttonsRow">
                        <div className="updateBtnWrapper">
                            <Button className="detailUpdateBtn" variant="primary" onClick={updatePost}>수정</Button>
                        </div>
                        <div className="deleteBtnWrapper">
                            <Button className="detailDeleteBtn" variant="danger" onClick={deletePost}>삭제</Button>
                        </div>
                        <div className="backToListBtnWrapper">
                            <Button className="detailBackToListBtn" variant="secondary" onClick={moveToList}>목록</Button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

export default PostDetail;