import { useState, useEffect } from "react";

const Manage = () => {
  
  const [memberIds, setMemberIds] = useState([]);
  const [memberNames, setMemberNames] = useState([]);
  
  // const [pageNumber, setPageNumber] = useState(1);
  // const [totalPages, setTotalPages] = useState(0);

  const fetchMembers = async () => {
    const response = await fetch(`http://127.0.0.1:5000/member_range?page=0&limit=10`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    const data = await response.json();
    console.log(data);
    const ids = data.map((member) => member._id);
    const names = data.map((member) => member.fullname);

    setMemberIds(ids);
    setMemberNames(names);
    
    // setTotalPages(Math.ceil(data.length / 10));
};
  
  useEffect(() => {
    fetchMembers();
  }, []);

  // const handlePageClick = (page) => {
  //   setPageNumber(page);
  //   fetchMembers();
  // };


  return (
    <div>
      <h1>Manage</h1>
      {memberIds.map((id, index) => (
        <div key={id}>
          <p>ID: {id}</p>
          <p>Name: {memberNames[index]}</p>
        </div>
      ))}
      {/* <div>
        {Array.from({ length: totalPages }, (_, index) => index + 1).map((page) => (
          <button key={page} onClick={() => handlePageClick(page)}>
            {page}
          </button>
        ))}
      </div> */}
    </div>
  );
};

export default Manage;