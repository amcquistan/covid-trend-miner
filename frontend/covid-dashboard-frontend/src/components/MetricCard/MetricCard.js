import React from 'react';

export const MetricCard = ({upperText, lowerText, metric}) => {
    return (
    <div className='col mb-4'>
        <div className='card'>
            <div className='card-body'>
                <h5 className='card-title'>{upperText}</h5>
                <h5 className='card-subtitle text-muted'>{lowerText}</h5>
                <h2 className='my-5 display-3'>{metric}</h2>
            </div>
        </div>
    </div>
    )
}