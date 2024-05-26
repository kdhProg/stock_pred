import {useNavigate} from "react-router-dom";
import axios from "axios";
import {useState} from "react";

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
        <div>
            <div>
                <label>제목</label>
                <input type="text" name="title" value={post.title} onChange={onChange}/>
            </div>
            <div>
                <select name="category" onChange={onChangeCategory}>
                    <option value="0" selected>공지사항</option>
                    <option value="1">자유게시판</option>
                </select>
            </div>
            <div>
                <label>내용</label>
                <textarea
                    name="content"
                    cols="30"
                    rows="10"
                    value={post.content}
                    onChange={onChange}
                ></textarea>
            </div>
            <div>
                <label htmlFor="isImportant">중요성여부</label><input id="isImportant" type="checkbox" name="isImportant"
                                                                 checked={post.isImportant === 1} onChange={onChangeChk}/>
                <br/>
                <label htmlFor="isSecret">비밀글여부</label><input id="isSecret" type="checkbox" name="isSecret"
                                                            checked={post.isSecret === 1} onChange={onChangeChk}/>
            </div>
            <br/>
            <div>
                <button onClick={savePost}>저장</button>
                <button onClick={backToList}>취소</button>
            </div>
        </div>
    )
}

export default PostWrite