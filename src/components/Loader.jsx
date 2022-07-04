import React, { useContext } from 'react'
import { Spinner } from 'react-bootstrap';
import CommonContext from '../context/CommonContext';

export default function Loader({ children }) {

    const { isLoading } = useContext(CommonContext);

    return <>
        {
            isLoading ? <div className="spinnerCenter"><Spinner animation="border" /> </div> :
                children
        }

    </>
}