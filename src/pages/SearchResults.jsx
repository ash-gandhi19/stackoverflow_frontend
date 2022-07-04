import { useContext, useEffect, useState } from 'react';
import { Button, Container } from 'react-bootstrap';
import axios from 'axios';
import { Link, useParams } from 'react-router-dom';
import Question from '../components/Question';
import CommonContext from '../context/CommonContext';
import { toast } from 'react-toastify';
import Loader from '../components/Loader';

export default function Questions() {

    const [questions, setQuestions] = useState([]);

    const params = useParams();
    const { setIsLoading } = useContext(CommonContext);

    useEffect(() => {

        const getSearchResults = async () => {

            try {
                setIsLoading(true);
                const { data } = await axios.get(`/questions/search?keyword=${params.keyword}`);
                setQuestions([...data]);
                setIsLoading(false);
            }
            catch (err) {
                setIsLoading(false);
                console.error(err);
                toast.error("Error fetching data from server! Refresh page or come back later.");
            }
        }

        getSearchResults();

    }, [params.keyword, setIsLoading]);

    return <Loader>
        <Container>
            <div className="questionsWrapper">
                <div className="questionsTopBody">
                    <div className="questionsTopTop">
                        <h2>Search results for "{params.keyword}"</h2>
                        <Link to="/questions/ask">
                            <Button className="skyBlueButton">Ask Question</Button>
                        </Link>
                    </div>
                    <div className="questionsTopBottom">
                        <p className='questionsLength'>{questions?.length} questions</p>
                    </div>
                </div>

                <div className="questionsBottom">

                    {
                        questions?.map(q => <Question key={q._id} q={q} />)
                    }


                </div>
            </div>
        </Container>
    </Loader>
}