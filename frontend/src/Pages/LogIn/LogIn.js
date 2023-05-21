import { useState } from "react";
import { useNavigate } from "react-router-dom";

const LogIn = () => {
  const [userInfo, setUserInfo] = useState({
    username: "",
    password: "",
  });
  const navigate = useNavigate();

  const getResult = async (e) => {
    e.preventDefault();
    await fetch(`http://127.0.0.1:5000/`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => response.json())
      .then((result) => {
        console.log("success");
        console.log(result);
      })
      .catch((error) => console.log(error));
  };

  const validateUser = async (e) => {
    e.preventDefault();
    let base = "http://127.0.0.1:5000/validate";
    base += `?username=${userInfo.username}&password=${userInfo.password}`;

    const response = await fetch(base, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    const result = await response.json();

    if (!response.ok) {
      alert(result.error);
    } else {
      console.log(result);
      navigate("/manage");
    }
  };

  return (
    <div>
      <h1>TripleC HR Management System</h1>
      <form>
        <label>Username:</label>
        <br />
        <input
          type="text"
          onChange={(e) => {
            setUserInfo({ ...userInfo, username: e.target.value });
          }}
          value={userInfo.username}
        />
        <br />
        <label>Password:</label>
        <br />
        <input
          type="password"
          onChange={(e) => {
            setUserInfo({ ...userInfo, password: e.target.value });
          }}
          value={userInfo.password}
        />
      </form>
      <button className="submit btn btn-primary" onClick={validateUser}>
        Sign In
      </button>
      <button onClick={getResult}>Get Current Table</button>
    </div>
  );
};

export default LogIn;
