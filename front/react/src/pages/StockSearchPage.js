import {useSelector} from "react-redux";
import React, {useState,useEffect} from "react";
import axios from "axios";


const StockSearchPage = ()=>{

    const globalKeywordStore = useSelector(state => state.string.value);
    const [schList, setSchList] = useState([]);

    const doSearch = async (keyword) => {
        await axios.get(`/pred/stockNameSearch?keyword=${keyword}`)
            .then((response) => {
                    setSchList(response.data)
                }
            )
            .catch((err) => {
                console.log(err.message);
            })
    }

    useEffect(() => {
        const fetchData = async () => {
            try {
                doSearch(globalKeywordStore);
            } catch (error) {
                console.error('Error:', error);
            }
        };

        fetchData();

        return () => {
            // cleanup 작업 수행
        };
    }, [globalKeywordStore]);


    return(
        <div>
            <p>검색어 : {globalKeywordStore}</p>
            <ul>
                {schList.map((elem) => (
                    <li key={elem}>
                        <p>{elem}</p>
                    </li>
                ))}
            </ul>
        </div>
    )
}

export default StockSearchPage;