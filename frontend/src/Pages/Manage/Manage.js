import { useState, useEffect } from "react";

const Manage = () => {
  const [memberIds, setMemberIds] = useState([]);
  const [memberNames, setMemberNames] = useState([]);
  const [memberdepartment, setMemberdepartment] = useState([]);
  const [memberemail, setMemberemail] = useState([]);
  const [memberenroll, setMemberenroll] = useState([]);
  const [membergithub, setMembergithub] = useState([]);
  const [membergrade, setMembergrade] = useState([]);
  const [memberLinkin, setMemberLinkin] = useState([]);
  const [memberwechat, setMemberwechat] = useState([]);

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
    console.log("123");
    const ids = data.map((member) => member._id);
    const names = data.map((member) => member.fullname);
    const department= data.map((member) => member.departments);
    const email= data.map((member) => member.email);
    const enroll= data.map((member) => member.enroll_time);
    const github= data.map((member) => member.github);
    const grade= data.map((member) => member.grade);
    const linkin= data.map((member) => member.linkedin);
    const wechat= data.map((member) => member.wechat);

    setMemberIds(ids);
    setMemberNames(names);
    setMemberdepartment(department);
    setMemberemail(email);
    setMemberenroll(enroll);
    setMembergithub(github);
    setMembergrade(grade);
    setMemberLinkin(linkin);
    setMemberwechat(wechat);
  };

  useEffect(() => {
    fetchMembers();
  }, []);

  return (
    <div>
      <h1>Manage</h1>
      {memberIds.map((id, index) => (
        <div key={id}>
          <p>Department: {memberdepartment[index]} Email: {memberemail[index]} Name: {memberNames[index]}  Enroll_time: {memberenroll[index]} github: {membergithub[index]} grade: {membergrade[index]} Linkedin: {memberLinkin[index]} wechat: {memberwechat[index]}</p>
        </div>
      ))}
    </div>
  );
};

export default Manage;
