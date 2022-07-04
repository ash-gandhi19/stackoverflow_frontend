import React, { useContext } from 'react'
import { useEffect, useState } from 'react';
import { Alert, Container, Form, FormControl } from 'react-bootstrap';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { AiOutlineSearch } from "react-icons/ai";
import CommonContext from '../context/CommonContext';
import { toast } from 'react-toastify';
import Loader from '../components/Loader';


export default function Tags() {

    const [tags, setTags] = useState([]);
    const [searchText, setSearchText] = useState("");
    const [searchResults, setSearchResults] = useState([]);
    const { setIsLoading } = useContext(CommonContext);

    const navi = useNavigate();


    useEffect(() => {

        const getTags = async () => {
            try {
                setIsLoading(true);
                const { data } = await axios.get(`/questions/tags`);
                setTags([...data]);
                setSearchResults([...data]);
                setIsLoading(false);
            }
            catch (err) {
                setIsLoading(false);
                console.error(err);
                toast.error("Error fetching data from server! Refresh page or come back later.");
            }
        }
        getTags();

    }, [setIsLoading]);

    useEffect(() => {

        let tagsTemp = tags;
        tagsTemp = tagsTemp.filter(t => t.includes(searchText));
        setSearchResults([...tagsTemp]);


    }, [searchText, tags]);

    const handleChange = (e) => {

        if (!e.target.value.includes(" ")) setSearchText(e.target.value);

    }

    const gotoTag = (tag) => {
        navi(`/tags/${tag}`);
    }

    return <Loader>
        <Container>
            <div className="questionsWrapper">
                <div className="questionsTopBody">
                    <div className="tagsTop">
                        <h2>Tags</h2>

                        <Form className="d-flex">
                            <FormControl
                                type="search"
                                placeholder="Search tags"
                                className="me-2"
                                aria-label="Search"
                                value={searchText}
                                onChange={handleChange}
                            />
                            <span className="searchIcon"><AiOutlineSearch /></span>

                        </Form>
                    </div>
                    <div className="questionsTopBottom">
                        {/* <p className='questionsLength'>12 questions</p> */}
                        <p>A tag is a keyword or label that categorizes your question with other, similar questions. Using the right tags makes it easier for others to find and answer your question.</p>

                    </div>
                </div>

                <div className="tagsBottom">

                    <div className="tagsDiv">
                        <ul className="tagsList">
                            {
                                searchResults?.map(t => <li key={t} className="tagsItem"
                                    onClick={() => gotoTag(t)}>
                                    <span className="tagName">{t}</span>
                                </li>)
                            }

                        </ul>
                        {
                            searchResults.length === 0 ? <div className="errorAlert">
                                <Alert>
                                    No results found for "{searchText}"
                                </Alert>
                            </div> : null
                        }
                    </div>
                </div>
            </div>
        </Container>
    </Loader>
}