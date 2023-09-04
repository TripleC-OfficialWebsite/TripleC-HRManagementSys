import React, { useState, useEffect } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";

const Add = (props) => {
  const navigate = useNavigate();
  const { name, disabled } = useParams();
  const boolDisabled = disabled === "true";

  const [fullname, setFullName] = useState("");
  const [department, setDepartment] = useState("");
  const [departmentPosition, setDepartmentPosition] = useState("");
  const [projectGroup, setProjectGroup] = useState("");
  const [projectGroupPosition, setProjectGroupPosition] = useState("");
  const [yearsInCollege, setYearsInCollege] = useState("");
  const [email, setEmail] = useState("");
  const [wechatId, setWechatId] = useState("");
  const [joinTime, setJoinTime] = useState("");
  const [linkedin, setLinkedin] = useState("");
  const [github, setGithub] = useState("");
  const [imageUrl, setImageUrl] = useState(null);

  const fetchImageUrl = async () => {
    const filename = `${name.replace(" ", "_")}.jpg`;

    const response = await fetch(
      `https://best-backend-ever.herokuapp.com/photo?filename=${filename}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    const data = await response.json();

    if (!response.ok) {
      setImageUrl(
        "https://drive.google.com/uc?id=1IV74ETbas-g-jFTHNVTs0kzvs4HxCF1p"
      );
    }

    if (data[0] && data[0][filename]) {
      setImageUrl(data[0][filename]);
    }
  };

  useEffect(() => {
    if (name !== undefined) {
      const fetchData = async () => {
        const response = await fetch(
          `https://best-backend-ever.herokuapp.com/mem/member/${name}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        const r = await response.json();
        setFullName(r[0].fullname);
        setDepartment(Object.keys(r[0].department).toString());
        setDepartmentPosition(Object.values(r[0].department).toString());
        setProjectGroup(Object.keys(r[0].project).toString());
        setProjectGroupPosition(Object.values(r[0].project).toString());
        setYearsInCollege(r[0].grade);
        setEmail(r[0].email);
        setWechatId(r[0].wechat);
        setJoinTime(r[0].enroll_time);
        setLinkedin(r[0].linkedin);
        setGithub(r[0].github);
      };
      fetchData();
    }
    if (disabled) {
      fetchImageUrl();
    }
  }, []);

  const handleFormSubmit = (e) => {
    e.preventDefault();

    // Split department and department position values into arrays
    const departmentArray = department.split(",");
    const departmentPositionArray = departmentPosition.split(",");

    // Split project group and project group position values into arrays
    const projectGroupArray = projectGroup.split(",");
    const projectGroupPositionArray = projectGroupPosition.split(",");

    // Ensure that the number of commas matches the number of positions
    if (departmentArray.length !== departmentPositionArray.length) {
      alert(
        "Please ensure that the number of positions matches the number of departments."
      );
      return;
    }
    if (projectGroupArray.length !== projectGroupPositionArray.length) {
      alert(
        "Please ensure that the number of positions matches the number of project groups."
      );
      return;
    }

    let departments = {};
    departmentArray.forEach(
      (key, i) => (departments[key] = departmentPositionArray[i])
    );
    let project = {};
    projectGroupArray.forEach(
      (key, i) => (project[key] = projectGroupPositionArray[i])
    );
    // Create an object with the parsed values
    const data = {
      fullname,
      department: departments,
      project,
      grade: yearsInCollege,
      email,
      wechat: wechatId,
      enrollTime: joinTime,
      linkedin,
      github,
    };

    // Perform further processing with the data as needed
    console.log(data);

    // Reset form fields
    setFullName("");
    setDepartment("");
    setDepartmentPosition("");
    setProjectGroup("");
    setProjectGroupPosition("");
    setYearsInCollege("");
    setEmail("");
    setWechatId("");
    setJoinTime("");
    setLinkedin("");
    setGithub("");

    // add the input data to backend
    addToBackend(data);
  };

  const addToBackend = async (data) => {
    const response = await fetch(
      `https://best-backend-ever.herokuapp.com/mem/member_add`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      }
    );
    const result = await response.json();
    try {
      if (!response.ok) {
        alert(result.error);
      } else {
        console.log(result);
        navigate("/manage");
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div>
      {!boolDisabled &&
        (name !== undefined ? <h1>Update User</h1> : <h1>Add User</h1>)}

      <form onSubmit={handleFormSubmit}>
        <div className="fullName">
          <label htmlFor="fullName">Full Name:</label>
          <input
            type="text"
            id="fullName"
            value={fullname}
            onChange={(e) => setFullName(e.target.value)}
            disabled={boolDisabled}
            required
          />
        </div>
        <div className="department">
          <label htmlFor="department">Department:</label>
          <input
            type="text"
            id="department"
            value={department}
            onChange={(e) => setDepartment(e.target.value)}
            disabled={boolDisabled}
            required
          />
        </div>
        <div className="departmentPosition">
          <label htmlFor="departmentPosition">Department Position:</label>
          <input
            type="text"
            id="departmentPosition"
            value={departmentPosition}
            onChange={(e) => setDepartmentPosition(e.target.value)}
            disabled={boolDisabled}
            required
          />
        </div>
        <div className="projectGroup">
          <label htmlFor="projectGroup">Project Group:</label>
          <input
            type="text"
            id="projectGroup"
            value={projectGroup}
            onChange={(e) => setProjectGroup(e.target.value)}
            disabled={boolDisabled}
            required
          />
        </div>
        <div className="projectGroupPosition">
          <label htmlFor="projectGroupPosition">Project Group Position:</label>
          <input
            type="text"
            id="projectGroupPosition"
            value={projectGroupPosition}
            onChange={(e) => setProjectGroupPosition(e.target.value)}
            disabled={boolDisabled}
            required
          />
        </div>
        <div className="yearsInCollege">
          <label htmlFor="yearsInCollege">Years in College:</label>
          <input
            type="text"
            id="yearsInCollege"
            value={yearsInCollege}
            onChange={(e) => setYearsInCollege(e.target.value)}
            disabled={boolDisabled}
            required
          />
        </div>
        <div className="email">
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={boolDisabled}
            required
          />
        </div>
        <div className="wechatId">
          <label htmlFor="wechatId">WeChat ID:</label>
          <input
            type="text"
            id="wechatId"
            value={wechatId}
            onChange={(e) => setWechatId(e.target.value)}
            disabled={boolDisabled}
            required
          />
        </div>
        <div className="joinTime">
          <label htmlFor="joinTime">Join Time:</label>
          <input
            type="text"
            id="joinTime"
            value={joinTime}
            onChange={(e) => setJoinTime(e.target.value)}
            disabled={boolDisabled}
            required
          />
        </div>
        <div className="linkedin">
          <label htmlFor="linkedin">LinkedIn:</label>
          <input
            type="text"
            id="linkedin"
            value={linkedin}
            onChange={(e) => setLinkedin(e.target.value)}
            disabled={boolDisabled}
          />
        </div>
        <div className="github">
          <label htmlFor="github">GitHub:</label>
          <input
            type="text"
            id="github"
            value={github}
            onChange={(e) => setGithub(e.target.value)}
            disabled={boolDisabled}
          />
        </div>
        {boolDisabled ? (
          <div>
            <label>Photo</label>
            <img
              src={imageUrl}
              alt="member"
              style={{ width: "40%", margin: "0 auto", display: "block" }}
            />
          </div>
        ) : (
          <h3>
            To add photo, go
            https://drive.google.com/drive/folders/18TIDcCxduEub6ysnNYmSflEKoldtzn7f
            and upload the photo by this naming: Firstname_Lastname.jpg
          </h3>
        )}

        {!boolDisabled &&
          (name !== undefined ? (
            <button type="submit">Update User</button>
          ) : (
            <button type="submit">Add User</button>
          ))}

        <Link className="btn-secondary btn" to={"/manage"}>
          Back
        </Link>
      </form>
    </div>
  );
};

export default Add;
