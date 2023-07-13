import React from "react";
import { useParams } from "react-router-dom";

const MemberDetails = ({ memberIds, memberNames }) => {
  const { id } = useParams();

  const index = memberIds[id];
  const memberName = memberNames[id]; 

  return (
    <div>
      <h2>Member Details</h2>
      <p>Member ID: {id}</p>
      <p>Member Name: {memberName}</p>
    </div>
  );
};

export default MemberDetails;
