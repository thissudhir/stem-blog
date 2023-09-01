import React, { useContext, useEffect, useState } from 'react';
import Edit from '../img/edit.png';
import Delete from '../img/delete.png';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu } from '../components/Menu';
import axios from 'axios';
import { AuthContext } from '../context/authContext';
import moment from 'moment';

export const Single = () => {
  const [post, setPost] = useState(null);
  

  const location = useLocation();
  const navigate = useNavigate();

  const postId = location.pathname.split('/')[2];

  const { currentUser } = useContext(AuthContext);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(`http://localhost:8800/api/posts/${postId}`); // Adjust the API endpoint
        setPost(res.data); // Set post data
      } catch (err) {
        console.log(err);
      }
    };
    fetchData();
  }, [postId]);

  const handleDelete = async () => {
    try {
      await axios.delete(`http://localhost:8800/api/posts/${postId}`);
      navigate('/');
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="single">
      <div className="content">
        {post && (
          <>
            <img src={post.main_image} alt="" />
            <div className="user">
              {currentUser && (
                <div className="edit">
                  <Link to={`/write?edit=${post.id}`} state={{ postData: post }}>
                    <img src={Edit} alt="Edit" />
                  </Link>
                  <img onClick={handleDelete} src={Delete} alt="Delete" />
                </div>
              )}
            </div>
            <h1>{post.name}</h1>
            <span>{post.description}</span>
            <span>
              <b>Difficult level:</b> {post.difficulty}
            </span>
            <span>
              <b>Subject: </b>
              {post.subject}
            </span>
            {/* Materials List */}
            {post.materials && post.materials.length > 0 && (
              <div className="section">
                <h2>Materials List</h2>
                <table>
                  <thead>
                    <tr>
                      <th>Material Name</th>
                      <th>Quantity</th>
                    </tr>
                  </thead>
                  <tbody>
                    {post.materials.map((material, index) => {
                      // console.log(`Rendering Material ${index}`);
                      return (
                        <tr key={`material-${index}`}>
                          <td>{material.name}</td>
                          <td>{material.quantity}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
            {/* Safety Precautions */}
            {post.safety_precautions && (
              <div className="section">
                <h2>Safety Precautions</h2>
                <p>{post.safety_precautions}</p>
              </div>
            )}
            {/* Step-by-step Instructions */}
            {post.steps && post.steps.length > 0 && (
              <div className="section">
                <h2>Step-by-step Instructions</h2>
                <ol>
                  {post.steps.map((step, index) => {
                    // console.log(`Rendering step ${index}`);
                    return (
                      <li key={`step-${index}`}>
                        <p>Step {step.step_number}</p>
                        <img src={step.image} alt={`Image ${step.step_number}`} />
                        <p>{step.description}</p>
                      </li>
                    );
                  })}
                </ol>
              </div>
            )}

          </>
        )}
      </div>
      <Menu subject={post && post.subject} />
    </div>
  );
};
