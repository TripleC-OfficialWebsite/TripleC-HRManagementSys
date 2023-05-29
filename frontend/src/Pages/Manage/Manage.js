import { useEffect } from 'react';
import { useState } from "react"
const Manage = () => {
  const [id, setId] = useState("")
  const [fullname, setFullname] = useState("");
  const [allmembers, setAllmembers] = useState([]);
  useEffect(() => {
    const FetchMember = async (e) => {
      e.preventDefault();
      let base = "http://127.0.0.1:5000/member";
      const response = await fetch (base, {
        method:"GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const result = await response.json();
      if (!response.ok) {
        alert(result.error);
      } else {
        setAllmembers(result)  
      }
    }; 
  }),[];
  return (
    <div>
      <h1>Manage</h1>
    </div>
  );
};

export default Manage;
