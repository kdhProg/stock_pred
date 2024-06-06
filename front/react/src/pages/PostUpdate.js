import {useEffect, useState} from "react";
import {useNavigate, useParams} from "react-router-dom";
import axios from "axios";
import "../css/PostUpdate.css"
import Button from "react-bootstrap/Button";

const PostUpdate = ()=>{


    /*
    *  Todo
    *   제목 / 내용 필수
    * 
    *  Todo 
    *   처음 렌더링 시 글 작성자와 현재 로그인 사용자 비교 및 불일치 시 경고창+목록으로 강제이동
    *
    * */


    const navigate = useNavigate();

    /* 요청용 필드 */
    const { postId } = useParams();

    /* 초기 서버 데이터 받기 + 수정 요청 전송용 */
    /* 카테고리는 수정 불가 */
    const [post, setPost] = useState({
        title: '',
        content: '',
        category: 0,
        isImportant:0,
        isSecret:0,
    });

    /* 단건 데이터 받아오기 */
    const getPost = async () => {
        const resp = await (await axios.get(`/post/${postId}`)).data;
        setPost(resp);
    };

    /* 수정 요청 */
    const updatePost = async () => {
        await axios.patch(`/post/${postId}`, post).then((res) => {
            alert('수정되었습니다.');
            backToDetail();
        });
    };

    /* 단건조회 페이지로 이동 */
    const backToDetail = () => {
        navigate('/post/' + postId);
    };

    /* 제목 / 내용 + post갱신 */
    const onChange = (e) => {
        const { value, name } = e.target;
        setPost({
            ...post,
            [name]: value,
        });
    };

    /* 비밀글 & 중요성 여부 체크+post갱신 */
    const onChangeChk = (e) => {
        const { name, checked } = e.target;
        setPost({
            ...post,
            [name]: checked ? 1 : 0,
        });
    };


    /*
    * 렌더링 시 post단건 받아오고 request객체의 category바로 업데이트하기
    * */
    useEffect(() => {
        getPost();
    }, []);

    return(
        <div className="postUpdateContainer">
            <br/><br/>
            <div className="titleRow">
                <div className="titleInfo">
                    <h4><b>제목</b></h4>
                </div>
                <div className="titleBoxWrapper">
                    <input className="titleInputBox" type="text" name="title" value={post.title}
                           onChange={onChange}/>
                </div>
            </div>
            <div className="categoryRow">
            <div className="categoryInfo">
                    <h5><b>카테고리</b></h5>
                </div>
                <div className="categoryBoxWrapper">
                    <b>{post.category === 0 ? "공지사항" : "자유게시판"}</b>
                </div>
            </div>
            <div className="contentRow">
                <div className="contentInfo">
                    <h5><b>내용</b></h5>
                </div>
                <div className="contentBoxWrapepr">
                <textarea
                    className="contentBox"
                    name="content"
                    value={post.content}
                    onChange={onChange}
                ></textarea>
                </div>
            </div>
            <div className="isImportantRow">
                <div className="isImportantInfo">
                    <h5><b>중요성여부</b></h5>
                </div>
                <div className="isImportantBoxWrapper">
                    <input className="isImportantBox" id="isImportant" type="checkbox" name="isImportant"
                           checked={post.isImportant === 1} onChange={onChangeChk}/>
                </div>
            </div>
            <div className="isSecretRow">
                <div className="isSecretRowInfo">
                <h5><b>비밀글여부</b></h5>
                </div>
                <div className="isSecretRowBoxWrapper">
                    <input className="isSecretBox" id="isSecret" type="checkbox" name="isSecret"
                           checked={post.isSecret === 1} onChange={onChangeChk}/>
                </div>
            </div>
            <br/>
            <div className="updateNcancelBtnRow">
                <div className="updateBtnWrapper">
                    <Button className="updateBtn" variant="primary" onClick={updatePost}>수정</Button>
                </div>
                <div className="cancelBtnWrapper">
                    <Button className="cancelBtn" variant="secondary" onClick={backToDetail}>취소</Button>
                </div>
            </div>
        </div>
    )
}

export default PostUpdate;