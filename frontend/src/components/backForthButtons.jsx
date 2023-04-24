import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function BackForthButtons() {
    const navigate = useNavigate();

    return (
        <div className='btn-group d-none d-md-block'>
            <button className='btn btn-dark' onClick={() => navigate(-1)}>
                <i className="fa-solid fa-arrow-left"/>
            </button>
            <button className='btn btn-dark' onClick={() => navigate(1)}>
                <i className="fa-solid fa-arrow-right"/>
            </button>
        </div>
    );
}