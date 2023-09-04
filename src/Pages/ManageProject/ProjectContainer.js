import { useState, useEffect } from "react";
import ProjectElement from "./ProjectElement";
import { Link } from "react-router-dom";

const ProjectContainer = () => {
  const [ProjectInfo, setProjectInfo] = useState([]);

  const fetchProjects = async () => {
    const response = await fetch(
      `https://best-backend-ever.herokuapp.com/pro/project`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    const d = await response.json();
    setProjectInfo(d);
    console.log(d);
  };
  useEffect(() => {
    fetchProjects();
  }, []);
  return (
    <div>
      <Link className="btn btn-primary" to="/projectModify">
        Add Project
      </Link>
      {ProjectInfo.map((value, index) => {
        return <ProjectElement content={value} key={index} />;
      })}
    </div>
  );
};

export default ProjectContainer;
