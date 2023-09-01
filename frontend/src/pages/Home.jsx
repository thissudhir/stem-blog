import React, { useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom';
import axios from 'axios';

export const Home = () => {
    const [posts, setPosts] = useState([]);

    const subject= useLocation().search

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await axios.get(`https://stem-blog.onrender.com/api/posts${subject}`); 
                setPosts(res.data);
            } catch (err) {
                console.log(err);
            }
        };
        fetchData();
    }, [subject]);

    const getText = (html) =>{
        const doc = new DOMParser().parseFromString(html, "text/html")
        return doc.body.textContent
    }

return (
    <div className="home">
        <div className="posts">
            {posts.map(post => (
                <div className="post" key={post.id}>
                    <div className="card">
                        <div className="img">
                            <img src={post.main_image} alt="" /> 
                        </div>
                        <div className="content">
                            <h1>{post.name}</h1> 
                            <p>{getText(post.description)}</p> 
                            <Link className='link' to={`/post/${post.id}`}>
                                <button>Know More</button>
                            </Link>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    </div>
);
};
