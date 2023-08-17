import axios from 'axios';
import React, { useEffect, useState } from 'react'

export const Menu = ({subject}) => {
    const [posts, setPosts] = useState([]);


    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await axios.get(`http://localhost:8800/api/posts?subject=${subject}`); // Adjust the API endpoint
                setPosts(res.data);
            } catch (err) {
                console.log(err);
            }
        };
        fetchData();
    }, [subject]);

  return (
    <div className='menu'>
        <h1>Other posts you may like</h1>
        {posts.map((post)=>(
            <div className="post" key={post.id}>
                <img src={post.main_image} alt="" />
                <h2>{post.name}</h2>
                <button>Read More</button>
            </div>
        ))}
    </div>
  )
}
