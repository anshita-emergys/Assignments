import React from 'react'
import { IoPersonSharp } from "react-icons/io5";
import { IoPersonOutline } from "react-icons/io5";

const Card = ({ title, count }) => {
  return (
    
        <div className='age-group-card'>
            <IoPersonOutline className='person-icon'/>
            <div className='card-header'>
                <p>{title}</p><h2>{count}</h2>
            </div>

        </div>

  )
}

export default Card