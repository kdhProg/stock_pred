import Pagination from "react-js-pagination";
import {useEffect, useState} from "react";
import axios from "axios";
import styled from 'styled-components'
import 'bootstrap/dist/css/bootstrap.css';
import {Link, useNavigate} from "react-router-dom";
import styles from '../css/PostList.module.css'
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";


const PostList = (props)=>{
    
    /*
    * 
    * Todo 비밀글여부 / 중요성여부 반영하여 화면에 출력
    * Todo 조건에 맞는 글이 0개면 적절한 문구or화면 띄우기
    * 
    * */


    const navigate = useNavigate();



    /* 화면 표시용 게시판 */
    let boardName = '';

    /* 기본 글 개수 */
    const defaultPostSize = 10;

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
        boardName = "자유게시판";
    }else{
        category = 0;
        boardName = "공지사항";
    }



    /* pagination에 사용되는 글 전체 개수 */
    const [totalSize, setTotalSize] = useState(0);
    const [totalSizeReq, setTotalSizeReq] = useState({
        category : category,
        keyword : ''
    });


    /*
    *
    * 추가 itemPerPage변수
    * - poReq의 size를 Pagination태그 itemsCountPerPage속성에 바로 적용시키면
    *   사용자설정검색 버튼을 누르기 전에 pagination이 state에 의해 바로 변경되므로
    *
    *  */
    const [sizeForPagination, setSizeForPagination] = useState(10);


    /* N개 조회 request */
    const [poReq, setPoReq] = useState({
        page : 1,
        size  : 10,
        category : category,
        sort : 'postId',
        keyword : ''
    });


    /* response담는 변수 */
    const [postList, setPostList] = useState([]);


    /* 글 개수 선택시 boardListParams값 갱신 */
    const handleSizeChange = (event) => {
        const { value } = event.target;
        setPoReq((prevParams) => ({
            ...prevParams,
            size: Number(value)
        }));
    };


    /* radio 선택시 boardListParams값 갱신 */
    const handleRadioChange = (event) => {
        const { value } = event.target;
        setPoReq((prevParams) => ({
            ...prevParams,
            sort: value
        }));
    };

    /* 검색어 입력시 boardListParams값 + setTotalSizeReq 갱신 */
    const handleKeywordChange = (event) => {
        const { value } = event.target;
        setPoReq((prevParams) => ({
            ...prevParams,
            keyword: value
        }));
        setTotalSizeReq((prevParams) => ({
            ...prevParams,
            keyword: value
        }));
    };

    /* pagination 페이지 클릭시 페이지값 갱신 */
    const handlePageChange = (currentPage) => {
        setPoReq((prevPoReq) => ({
            ...prevPoReq,
            page: currentPage,
        }));
    };

    /* 해당카테고리+검색어 전체 글 개수 - pagination에 필요 */
    const getEntirePostsCount = async () => {
        const resp = await (await axios.get(`/post/getPostsCount?category=${totalSizeReq.category}&keyword=${totalSizeReq.keyword}`));
        setTotalSize(resp.data);
        if(resp.data === 0){setIsPostListEmpty(true)}
    }

    /* 검색 수행 */
    const getPosts = async ()=>{

        /* 먼저 전체 글 개수 세팅 */
        await getEntirePostsCount();

        setSizeForPagination(poReq.size); // 로드될 때 pagination 넘버 재설정 되도록

        const resp = await (await axios.get(`/post/getPosts?page=${poReq.page}&size=${poReq.size}&sort=${poReq.sort}&category=${poReq.category}&keyword=${poReq.keyword}`));
        setPostList(resp.data);
        setIsLoading(false)
    }


    /* 글쓰기 페이지로 이동 */
    const moveToWrite = () => {
        navigate('/PostWrite');
    };


    useEffect(() => {
        getPosts();
    }, [poReq.page]);



    return(
        <div>
            <Container>
                <br/>
                <br/>
                <Row>
                    <Col/>
                    <Col className={styles.boardName}>
                        <p>{boardName}</p>
                    </Col>
                    <Col/>
                </Row>
                <Row>
                    <Col md={2}>
                        <p>정렬기준</p>
                    </Col>
                    <Col>
                        <label htmlFor="postId">최신순</label>
                        <input type="radio" id="postId" name="sort" value="postId" onChange={handleRadioChange}/>
                        &nbsp;&nbsp;&nbsp;
                        <label htmlFor="likes">추천수</label>
                        <input type="radio" id="likes" name="sort" value="likes" onChange={handleRadioChange}/>
                        &nbsp;&nbsp;&nbsp;
                        <label htmlFor="reports">신고수</label>
                        <input type="radio" id="reports" name="sort" value="reports" onChange={handleRadioChange}/>
                        &nbsp;&nbsp;&nbsp;
                        <label htmlFor="updateDate">마지막 수정일</label>
                        <input type="radio" id="updateDate" name="sort" value="updateDate" onChange={handleRadioChange}/>
                    </Col>
                </Row>
                <Row>
                    <Col md={2}>
                        <label htmlFor="quantity">페이지 당 글</label>
                    </Col>
                    <Col>
                    <Form.Control type="number" id="quantity" name="quantity" min="5" max="2000"
                               onChange={handleSizeChange} defaultValue={defaultPostSize}/>
                    </Col>
                </Row>
                <Row>
                    <Col md={2}>
                        <p>검색</p>
                    </Col>
                    <Col>
                        <Form.Control type="text" onChange={handleKeywordChange}/>
                    </Col>
                </Row>
                <Row>
                    <Col>
                        <button onClick={getPosts}>다시 로드하기</button>
                    </Col>
                </Row>
                <Row>
                    <Col>
                        번호
                    </Col>
                    <Col>
                        제목
                    </Col>
                    <Col>
                        작성자
                    </Col>
                    <Col>
                        작성일
                    </Col>
                </Row>
                { isLoading ?(
                    <Row><Col>loading lists....</Col></Row>
                ): (
                    <div>
                        {postList.map((post) => (
                            <Row key={post.postId}>
                                <Col>
                                    <p>{post.postId}</p>
                                </Col>
                                <Col>
                                    <Link className="link-success" to={`/post/${post.postId}`}>{post.title}</Link>
                                </Col>
                                <Col>
                                    <p>{post.author}</p>
                                </Col>
                                <Col>
                                <p>{(post.createdAt).substring(0,10)}</p>
                                </Col>
                            </Row>
                        ))}
                    </div>
                )
                }
            <Row>
                <PaginationBox>
                    <Pagination
                        activePage={poReq.page}
                        itemsCountPerPage={sizeForPagination}
                        totalItemsCount={totalSize}
                        pageRangeDisplayed={10}
                        onChange={handlePageChange}>
                    </Pagination>
                </PaginationBox>
            </Row>
            <Row>
                <Col md={10}/>
                <Col>
                    <Button variant="secondary" onClick={moveToWrite}>글쓰기</Button>
                </Col>
            </Row>
            </Container>
        </div>
    )
}

const PaginationBox = styled.div`
  .pagination { display: flex; justify-content: center; margin-top: 15px;}
  ul { list-style: none; padding: 0; }
  ul.pagination li {
    display: inline-block;
    width: 30px;
    height: 30px;
    border: 1px solid #e2e2e2;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 1rem; 
  }
  ul.pagination li:first-child{ border-radius: 5px 0 0 5px; }
  ul.pagination li:last-child{ border-radius: 0 5px 5px 0; }
  ul.pagination li a { text-decoration: none; color: #337ab7; font-size: 1rem; }
  ul.pagination li.active a { color: white; }
  ul.pagination li.active { background-color: #337ab7; }
  ul.pagination li a:hover,
  ul.pagination li a.active { color: blue; }
`



export default PostList;