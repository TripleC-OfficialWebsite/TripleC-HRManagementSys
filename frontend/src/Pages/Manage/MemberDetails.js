import React, {useEffect, useState} from "react";
import { useParams } from "react-router-dom";

const MemberDetails = () => {
  const [memberInfo, setMemberInfo] = useState({});
  const { name } = useParams();
  const fetchMember = async () => {
    const response = await fetch(
      `https://best-backend-ever.herokuapp.com/mem/member/${name}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    const data = await response.json();

    setMemberInfo(data[0]);
  }

  useEffect(() => {
    fetchMember();
    console.log(memberInfo);
  }, []);

  return (
    <div>
      <h2>Member Details</h2>
      {/* <p>Member ID: {memberInfo[id]}</p> */}
      <p>Member Name: {memberInfo.fullname}</p>
    </div>
  );
};

export default MemberDetails;
