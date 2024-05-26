import {Pagination} from "react-bootstrap";
import {useEffect, useState} from "react";
import axios from "axios";
import {useNavigate} from "react-router-dom";

const PostList = (props)=>{
    
    /*
    * 
    * Todo 비밀글여부 / 중요성여부 반영하여 화면에 출력
    * 
    * */


    const navigate = useNavigate();

    /* 글이 로드되었는가 */
    const [isLoading, setIsLoading] = useState(true);

    /* 글이 하나도 존재하지 않는가 */
    const [isPostListEmpty, setIsPostListEmpty] = useState(false);

    /*
    *
    * 카테고리
    *
    * Notice(공지사항) - 0
    * freeBoard(자유게시판) - 1
    *
    * */
    let category;
    if(props.category === "freeBoard"){
        category = 1;
    }else{
        category = 0;
    }

    /* pagination에 사용되는 글 전체 개수 */
    const [totalSize, setTotalSize] = useState(0);
    const [totalSizeReq, setTotalSizeReq] = useState({
        category : category,
        keyword : ''
    });

    /* 현재 페이지 */
    const [page, setPage] = useState(1);

    /* N개 조회 request */
    const [poReq, setPoReq] = useState({
        page : 1,
        size  : 10,
        category : category,
        sort : 'postId',
        keyword : ''
    });


    /* response담는 변수 */
    const [boardList, setBoardList] = useState([]);


    /* 글 개수 선택시 boardListParams값 갱신 */
    const handleSizeChange = (event) => {
        const { value } = event.target;
        setPoReq((prevParams) => ({
            ...prevParams,
            size: value
        }));
        setTotalSizeReq(event.target);
    };


    /* radio 선택시 boardListParams값 갱신 */
    const handleRadioChange = (event) => {
        const { value } = event.target;
        setPoReq((prevParams) => ({
            ...prevParams,
            sort: value
        }));
    };

    /* 검색어 입력시 boardListParams값 갱신 */
    const handleKeywordChange = (event) => {
        const { value } = event.target;
        setPoReq((prevParams) => ({
            ...prevParams,
            keyword: value
        }));
    };

    /* pagination 페이지 클릭시 페이지값 갱신 */
    const handlePageChange = (currentPage) => {
        setPage(currentPage)
    };

    /* 해당카테고리+검색어 전체 글 개수 - pagination에 필요 */
    const getEntirePostsCount = async () => {
        const resp = await (await axios.get(`/post/getPostsCount?category=${totalSizeReq.category}&keyword=${totalSizeReq.keyword}`));
        setTotalSize(resp.data);
        if(resp.data === 0){setIsPostListEmpty(true)}
    }

    /* 검색 수행 */
    const getPosts = async ()=>{
        const resp = await (await axios.get(`/post/getPosts?page=${page}&size=${poReq.size}&sort=${poReq.sort}&category=${poReq.category}&keyword=${poReq.keyword}`));
        setBoardList(resp.data);
        setIsLoading(false)
    }


    useEffect(() => {
        const fetchData = async () => {
            await getEntirePostsCount();
            await getPosts();
        };

        fetchData();
    }, []);

    const moveToWrite = () => {
        navigate('/PostWrite');
    };

    return(
        <div>
            <h1>{props.category}</h1>
            <button onClick={moveToWrite}>글쓰기</button>
            <div>
                <label htmlFor="quantity">한번에 불러올 글 개수(기본값10, max=2000)</label>
                <input type="number" id="quantity" name="quantity" min="1" max="2000" onChange={handleSizeChange} defaultValue="10"/>
            </div>
            <div>
                <h3>정렬기준</h3>
                <label htmlFor="postId">최신순</label>
                <input type="radio" id="postId" name="sort" value="postId" onChange={handleRadioChange}/>
                <br/>
                <label htmlFor="likes">추천수</label>
                <input type="radio" id="likes" name="sort" value="likes" onChange={handleRadioChange}/>
                <br/>
                <label htmlFor="reports">신고수</label>
                <input type="radio" id="reports" name="sort" value="reports" onChange={handleRadioChange}/>
                <br/>
                <label htmlFor="updateDate">마지막 수정일</label>
                <input type="radio" id="updateDate" name="sort" value="updateDate" onChange={handleRadioChange}/>
            </div>
            <div>
                <label htmlFor="">(제목기반 검색)검색</label><input type="text" onChange={handleKeywordChange}/>
            </div>
            <div>
                <button onClick={getPosts}>다시 로드하기</button>
            </div>
            <div>
                <hr/>
                <h3>글 목록</h3>
                <div>
                    { isLoading ?(
                        <p>loading lists....</p>
                    ): (
                        <ul>
                            {boardList.map((post) => (
                                <li key={post.postId}>
                                    <span>{post.title}</span>
                                    {/*<Link className="link-success" to={`/board/${board.postId}`}>{board.title}</Link>*/}
                                </li>
                            ))}
                        </ul>
                    )
                    }

                </div>
                <div>
                    <Pagination
                        activePage={page}
                        itemsCountPerPage={poReq.size}
                        totalItemsCount={totalSize}
                        pageRangeDisplayed={10}
                        onChange={handlePageChange}>
                    </Pagination>
                </div>
            </div>
        </div>
    )
}

export default PostList;