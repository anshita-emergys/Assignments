import React from 'react'
import { IoPersonSharp } from "react-icons/io5";

const Card = ({ title, count }) => {
  return (
    
        <div className='age-group-card'>
            <p>{title}</p>
            <div className='card-header'>
                <IoPersonSharp/><h2>{count}</h2>
            </div>

        </div>

  )
}

export default Card