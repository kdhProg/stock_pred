import {useNavigate} from "react-router-dom";
import axios from "axios";
import {useState} from "react";
import "../css/PostWrite.css"
import Button from "react-bootstrap/Button";

const PostWrite = ()=>{

    /*
    * Todo
    *  관리자 계정
    *   - 어떤 게시판이든 작성 가능 - 공지사항, 자유게시판 ... 등
    *   - 중요성 여부 지정 가능
    *  일반사용자 - 공지사항은 선택 불가
    * 
    *  Todo
    *   제목 / 내용 필수
    *
    * */

    const navigate = useNavigate();

    const [post, setPost] = useState({
        title: '',
        content: '',
        category: 0,
        isImportant:0,
        isSecret:0,

    });

    /* 카테고리 */
    const onChangeCategory = (e)=>{
        const { value, name } = e.target;
        const newValue = value === '0' ? 0 : 1;
        setPost({
            ...post,
            [name]: newValue,
        });
    }

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

    const savePost = async () => {
        await axios.post(`/post/savePost`, post).then((res) => {
            alert('등록되었습니다.');
            if(post.category === 0){navigate('/NoticePage');}
            else{navigate('/FreeBoardPage');}
        });
    };


    const backToList = () => {
        if(post.category === 0){navigate('/NoticePage');}
        else{navigate('/FreeBoardPage');}
    };

    return(
        <div className="postWriteContainer">
            <br/><br/>
            <div className="titleRow">
                <div className="titleInfo">
                    <h4><b>제목</b></h4>
                </div>
                <div className="titleBoxWrapper">
                    <input className="titleInputBox" type="text" name="title" value={post.title} onChange={onChange}/>
                </div>
            </div>
            <div className="categoryRow">
                <div className="categoryInfo">
                    <h5><b>카테고리</b></h5>
                </div>
                <div className="categoryBoxWrapper">
                    <select name="category" onChange={onChangeCategory}>
                        <option value="0" selected>공지사항</option>
                        <option value="1">자유게시판</option>
                    </select>
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
            <div className="saveNcancelBtnRow">
                <div className="saveBtnWrapper">
                    <Button className="saveBtn" variant="success" onClick={savePost}>저장</Button>
                </div>
                <div className="cancelBtnWrapper">
                    <Button className="cancelBtn" variant="secondary" onClick={backToList}>취소</Button>
                </div>
            </div>
        </div>
    )
}

export default PostWrite