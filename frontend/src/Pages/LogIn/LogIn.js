const getResult = () => {
  fetch(`http://localhost:5000`, {
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
      <button onClick={getResult}>Get Current Table</button>
    </div>
  );
};

export default LogIn;
