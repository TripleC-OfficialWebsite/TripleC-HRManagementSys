import { useState, useEffect } from "react";

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

  const fetchMembers = async () => {
    const response = await fetch(
      `http://127.0.0.1:5000/mem/member_range/0&10`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    const data = await response.json();
    console.log(data);
    const ids = data.map((member) => member._id);
    const names = data.map((member) => member.fullname);
    const projectObj = data.map((member) => member.project);
    const email = data.map((member) => member.email);
    const enrollTime = data.map((member) => member.enroll_time);
    const github = data.map((member) => member.github);
    const linkin = data.map((member) => member.linkedin);
    const grade = data.map((member) => member.grade);
    const wechat = data.map((member) => member.wechat);
    const departmentObj = data.map((member) => member.department);

    setMemberIds(ids);
    setMemberNames(names);
    setMemberEmail(email);
    setMemberEnrollTime(enrollTime);
    setMemberGithub(github);
    setMemberLinkin(linkin);
    setMemberGrade(grade);
    setMemberWechat(wechat);
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

  useEffect(() => {
    fetchMembers();
  }, []);

  return (
    <div>
      <h1>Manage</h1>
      {memberIds.map((id, index) => (
        <div key={id}>
          <p>ID: {id} Name: {memberNames[index]} Department: {memberDepartment[index].join("/")} Department Position: {memberDepartmentPosition[index].join("/")} Project: {memberProject[index].join("/")} Project Role: {memberProjectRole[index].join("/")} Grade: {memberGrade[index]} Email: {memberEmail[index]} Wechat: {memberWechat[index]} Enroll Time: {memberEnrollTime[index]} Linkin: {memberLinkin[index]} Github: {memberGithub[index]} </p>
        </div>
      ))}
    </div>
  );
};

export default Manage;
