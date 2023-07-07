import { useState, useEffect } from "react";
import { Link } from 'react-router-dom';

const Manage = () => {
  const [memberIds, setMemberIds] = useState([]);
  const [memberNames, setMemberNames] = useState([]);
  const [memberEmail, setMemberEmail] = useState([]);
  const [memberEnrollTime, setMemberEnrollTime] = useState([]);
  const [memberGithub, setMemberGithub] = useState([]);
  const [memberLinkin, setMemberLinkin] = useState([]);
  const [memberGrade, setMemberGrade] = useState([]);
  const [memberWechat, setMemberWechat] = useState([]);
  const [memberDepartment, setMemberDepartment] = useState([]);
  const [memberDepartmentPosition, setMemberDepartmentPosition] = useState("");
  const [memberProject, setMemberProject] = useState([]);
  const [memberProjectRole, setMemberProjectRole] = useState([]);
  const [memberPicture, setMemberPicture] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState([]);


  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };
  const fetchtotal = async () => {
    const response = await fetch(
      `https://best-backend-ever.herokuapp.com/mem/member`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    const d = await response.json();
    setTotalPages(Math.ceil(d.length/10))
  };
  const fetchMembers = async () => {
    const response = await fetch(
      `https://best-backend-ever.herokuapp.com/mem/member_range/${currentPage}&10`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    const data = await response.json();
    const ids = data.map((member) => member._id);
    const names = data.map((member) => member.fullname);
    const email = data.map((member) => member.email);
    const enrollTime = data.map((member) => member.enroll_time);
    const github = data.map((member) => member.github);
    const linkin = data.map((member) => member.linkedin);
    const grade = data.map((member) => member.grade);
    const wechat = data.map((member) => member.wechat);
    const picture = data.map((member) => member.picture);
    const departmentObj = data.map((member) => member.department);
    const projectObj = data.map((member) => member.project);

    setMemberIds(ids);
    setMemberNames(names);
    setMemberEmail(email);
    setMemberEnrollTime(enrollTime);
    setMemberGithub(github);
    setMemberLinkin(linkin);
    setMemberGrade(grade);
    setMemberWechat(wechat);
    setMemberPicture(picture);
    const departments = [];
    const depRoles = [];
    for (const item of departmentObj) {
      departments.push(Object.keys(item));
      depRoles.push(Object.values(item));
    }
    setMemberDepartment(departments);
    setMemberDepartmentPosition(depRoles);
    const projects = [];
    const projRoles = [];
    for (const item of projectObj) {
      projects.push(Object.keys(item));
      projRoles.push(Object.values(item));
    }
    setMemberProject(projects);
    setMemberProjectRole(projRoles);
  };

  const handleDelete = async (fullname) => {
    const response = await fetch(`https://best-backend-ever.herokuapp.com/mem/member_delete/${fullname}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    fetchMembers();

    const result = await response.json();

    try {
      if (!response.ok) {
        alert(result.error);
      } else {
        console.log(result);
      }
    } catch (error) {
      console.log(error);
    }
    
  }

  useEffect(() => {
    fetchMembers();
  }, []);

  useEffect(() => {
    fetchMembers();
    fetchtotal();
  },[currentPage]);

  return (
    <div>
      <h1>Manage</h1>
      <Link className="btn btn-primary" to="/add">Add a member</Link>
      <table className="table table-hover">
        <thead>
          <tr>
            <th scope="col">ID</th>
            <th scope="col">Name</th>
            <th scope="col">Department</th>
            <th scope="col">Department Position</th>
            <th scope="col">Project</th>
            <th scope="col">Project Role</th>
            <th scope="col">Functionality</th>
          </tr>
        </thead>
        <tbody>
        {memberIds.map((id, index) => (
          <tr>
          <th scope="row">{index + 1}</th>
          <td > {memberNames[index]}</td>
          <td>{memberDepartment[index].join("/")} </td>
          <td>{memberDepartmentPosition[index].join("/")}</td>
          <td>{memberProject[index].join("/")}</td>
          <td>{memberProjectRole[index].join("/")}</td>
          <td><button
              key={index}
              onClick={() => handleDelete(memberNames[index])}> delete
            </button>
          </td>
        </tr>
        ))}
        </tbody>
      <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
          />
        </table>
  </div>
  );
};

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  return (
    <div className="pagination">
      {[...Array(totalPages)].map((_, index) => (
        <button
          key={index}
          className={index === currentPage ? "active" : ""}
          onClick={() => onPageChange(index)}
        >
          {index + 1}
        </button>
      ))}
    </div>
  );
};

export default Manage;
