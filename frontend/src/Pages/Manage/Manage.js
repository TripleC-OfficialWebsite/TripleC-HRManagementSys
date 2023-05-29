import { useState, useEffect } from "react";

const Manage = () => {
  
  const [memberIds, setMemberIds] = useState([]);
  const [memberNames, setMemberNames] = useState([]);

  const fetchMembers = async () => {
    const response = await fetch(`http://127.0.0.1:5000/member_range?page=0&limit=10`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    const data = await response.json();
    console.log(data);
    console.log('123');
    const ids = data.map((member) => member._id);
    const names = data.map((member) => member.fullname);

    setMemberIds(ids);
    setMemberNames(names);
};
  
  useEffect(() => {
    fetchMembers();
  }, []);

  return (
    <div>
      <h1>Manage</h1>
      {memberIds.map((id, index) => (
        <div key={id}>
          <p>ID: {id}</p>
          <p>Name: {memberNames[index]}</p>
        </div>
      ))}
    </div>
  );
};

export default Manage;
