import { useContext, useEffect, useState } from 'react';
import { Button, Container } from 'react-bootstrap';
import axios from 'axios';
import Question from '../components/Question';
import { Link } from 'react-router-dom';
import CommonContext from "../context/CommonContext";
import { toast } from "react-toastify";
import Loader from '../components/Loader';
import Pagination from "react-js-pagination";

export default function Questions() {

    const [questions, setQuestions] = useState([]);
    const { setIsLoading } = useContext(CommonContext);
    const [totalQuestions, setTotalQuestions] = useState();
    const [currentPage, setCurrentPage] = useState(1);

    useEffect(() => {

        const getQuestions = async () => {

            try {

                setIsLoading(true);

                const { data } = await axios.get(`/questions/all?page=${currentPage}`);

                setQuestions([...data.questions]);
                setTotalQuestions(data.noOfQuestions);
                setIsLoading(false);

            }
            catch (err) {
                setIsLoading(false);
                toast.error("Error fetching data from server! Refresh page or come back later.");
                console.error(err);
            }
        }

        getQuestions();

    }, [setIsLoading, currentPage]);

    return <Loader>
        <Container>
            <div className="questionsWrapper">
                <div className="questionsTopBody">
                    <div className="questionsTopTop">
                        <h2>All Questions</h2>
                        <Link to="/questions/ask">
                            <Button className="skyBlueButton">Ask Question</Button>
                        </Link>
                    </div>
                    <div className="questionsTopBottom">
                        <p className='questionsLength'>{totalQuestions} questions</p>
                    </div>
                </div>
                <div className="questionsBottom">
                    {
                        questions?.map(q => <Question key={q._id} q={q} />)
                    }
                </div>

                {
                    totalQuestions > 10 &&

                    <div className="paginationDiv">
                        <span>page</span>
                        <Pagination
                            activePage={currentPage}
                            itemsCountPerPage={10}
                            totalItemsCount={totalQuestions}
                            onChange={(e) => setCurrentPage(e)}
                            nextPageText={'Next'}
                            prevPageText={'Prev'}
                            firstPageText={'First'}
                            lastPageText={'Last'}
                            itemClass="page-item"
                            linkClass="page-link"
                        />
                    </div>
                }
            </div>
        </Container>
    </Loader>
}