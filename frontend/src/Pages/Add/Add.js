import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Add = () => {
  const navigate = useNavigate();

  const [fullname, setFullName] = useState('');
  const [department, setDepartment] = useState('');
  const [departmentPosition, setDepartmentPosition] = useState('');
  const [projectGroup, setProjectGroup] = useState('');
  const [projectGroupPosition, setProjectGroupPosition] = useState('');
  const [yearsInCollege, setYearsInCollege] = useState('');
  const [email, setEmail] = useState('');
  const [wechatId, setWechatId] = useState('');
  const [joinTime, setJoinTime] = useState('');
  const [linkedin, setLinkedin] = useState('');
  const [github, setGithub] = useState('');
  const [photo, setPhoto] = useState(null);

  const handleFormSubmit = (e) => {
    e.preventDefault();

    // Split department and department position values into arrays
    const departmentArray = department.split(',');
    const departmentPositionArray = departmentPosition.split(',');

    // Split project group and project group position values into arrays
    const projectGroupArray = projectGroup.split(',');
    const projectGroupPositionArray = projectGroupPosition.split(',');

    // Ensure that the number of commas matches the number of positions
    if (departmentArray.length !== departmentPositionArray.length){
        alert('Please ensure that the number of positions matches the number of departments.');
        return;
    }
    if (projectGroupArray.length !== projectGroupPositionArray.length){
        alert('Please ensure that the number of positions matches the number of project groups.');
        return;
    }

    // Create an object with the parsed values
    const data = {
      fullname,
      department: departmentArray,
      departmentPosition: departmentPositionArray,
      projectGroup: projectGroupArray,
      projectGroupPosition: projectGroupPositionArray,
      yearsInCollege,
      email,
      wechatId,
      joinTime,
      linkedin,
      github,
      photo,
    };

    // Perform further processing with the data as needed
    console.log(data);

    // Reset form fields
    setFullName('');
    setDepartment('');
    setDepartmentPosition('');
    setProjectGroup('');
    setProjectGroupPosition('');
    setYearsInCollege('');
    setEmail('');
    setWechatId('');
    setJoinTime('');
    setLinkedin('');
    setGithub('');
    setPhoto(null);

    // add the input data to backend
    addToBackend(data);
  };

  const addToBackend = async (data) => {
    const response = await fetch(`http://127.0.0.1:5000/mem/member_add`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    const result = await response.json();
    try {
      if (!response.ok) {
        alert(result.error);
      } else {
        console.log(result);
        navigate('/manage');
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handlePhotoUpload = (e) => {
    const file = e.target.files[0];
    setPhoto(file);
  };

  return (
    <div>
      <h1>Add User</h1>
      <form onSubmit={handleFormSubmit}>
        <div className="fullName">
          <label htmlFor="fullName">Full Name:</label>
          <input type="text" id="fullName" value={fullname} onChange={(e) => setFullName(e.target.value)} required />
        </div>
        <div className="department">
          <label htmlFor="department">Department:</label>
          <input type="text" id="department" value={department} onChange={(e) => setDepartment(e.target.value)} required />
        </div>
        <div className="departmentPosition">
          <label htmlFor="departmentPosition">Department Position:</label>
          <input type="text" id="departmentPosition" value={departmentPosition} onChange={(e) => setDepartmentPosition(e.target.value)} required />
        </div>
        <div className="projectGroup">
          <label htmlFor="projectGroup">Project Group:</label>
          <input type="text" id="projectGroup" value={projectGroup} onChange={(e) => setProjectGroup(e.target.value)} required />
        </div>
        <div className="projectGroupPosition">
          <label htmlFor="projectGroupPosition">Project Group Position:</label>
          <input type="text" id="projectGroupPosition" value={projectGroupPosition} onChange={(e) => setProjectGroupPosition(e.target.value)} required />
        </div>
        <div className="yearsInCollege">
          <label htmlFor="yearsInCollege">Years in College:</label>
          <input type="text" id="yearsInCollege" value={yearsInCollege} onChange={(e) => setYearsInCollege(e.target.value)} required />
        </div>
        <div className="email">
          <label htmlFor="email">Email:</label>
          <input type="email" id="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        </div>
        <div className="wechatId">
          <label htmlFor="wechatId">WeChat ID:</label>
          <input type="text" id="wechatId" value={wechatId} onChange={(e) => setWechatId(e.target.value)} required />
        </div>
        <div className="joinTime">
          <label htmlFor="joinTime">Join Time:</label>
          <input type="text" id="joinTime" value={joinTime} onChange={(e) => setJoinTime(e.target.value)} required />
        </div>
        <div className="linkedin">
          <label htmlFor="linkedin">LinkedIn:</label>
          <input type="text" id="linkedin" value={linkedin} onChange={(e) => setLinkedin(e.target.value)} />
        </div>
        <div className="github">
          <label htmlFor="github">GitHub:</label>
          <input type="text" id="github" value={github} onChange={(e) => setGithub(e.target.value)} />
        </div>
        <div>
          <label htmlFor="photo">Photo:</label>
          {/* Render a file input type hidden */}
          <input type="file" id="photoInput" accept="image/*" onChange={handlePhotoUpload} style={{ display: 'none' }} />
          {/* Render a button that triggers the hidden file input */}
          <button type="button" onClick={() => document.getElementById('photoInput').click()}>Upload Photo</button>
          {/* Display the uploaded photo filename */}
          {photo && <span>{photo.name}</span>}
        </div>
        <button type="submit">Add User</button>
      </form>
    </div>
  );
};

export default Add;
