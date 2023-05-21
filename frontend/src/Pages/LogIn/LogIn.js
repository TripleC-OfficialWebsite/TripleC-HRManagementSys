const getResult = () => {
  fetch(`http://127.0.0.1:5000/`, {
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

const LogIn = () => {
  return (
    <div>
       <form>
      <h1>TripleC Management System</h1>
      <label name="name">Username:</label><br />
      <input type="text" id="name" name="name" /><br />
      <label name="name">Password:</label><br />
      <input type="text" id="name" name="name" /><br />
      <h1> </h1>
      <button onClick={getResult}>Sign in</button>
      </form>
      </div>

  );
};

export default LogIn;
