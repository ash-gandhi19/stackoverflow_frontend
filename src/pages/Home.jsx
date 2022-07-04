import { useContext, useEffect, useState } from 'react';
import { Button, Container } from 'react-bootstrap';
import axios from 'axios';
import { toast } from 'react-toastify';
import Question from '../components/Question';
import { Link, useNavigate } from 'react-router-dom';
import Loader from '../components/Loader';
import CommonContext from '../context/CommonContext';

export default function Home() {

    const [questions, setQuestions] = useState([]);
    const { setIsLoading } = useContext(CommonContext);
    const navi = useNavigate();

    const goToQuestions = () => {
       navi("/questions");
    }

    useEffect(() => {

        const getTopQuestions = async () => {

            try {
                setIsLoading(true);
                const { data } = await axios.get(`/questions/all?filter=votes`);
                setQuestions([...data.questions]);
                setIsLoading(false);
            }
            catch (err) {
                setIsLoading(false);
                console.error(err);
                toast.error("Error fetching data from server! Refresh page or come back later.");
            }
        }

        getTopQuestions();

    }, [setIsLoading]);


    return <Loader>
        <Container>
            <div className="homeWrapper">
                <div className="homeTop">
                    <h2>Top Questions</h2>
                    <Link to="/questions/ask">
                        <Button className="skyBlueButton">Ask Question</Button>
                    </Link>
                </div>
                <div className="homeBottom">
                    {
                        questions?.map(q => <Question key={q._id} q={q} />)
                    }
                </div>
                <div className="moreQuestionsDiv">
                    <p className="moreQuestionsPara" onClick={goToQuestions} >
                        Looking for more? Browse the complete list of questions...
                    </p>
                </div>
            </div>
        </Container>
    </Loader>
}