import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const ProjectElement = (props) => {
  return (
    <div className="card m-3">
      <div className="card-header">{props.content.title}</div>
      <div className="card-body">
        <h5 class="card-title">{props.content.type}</h5>
        <p className="card-text">{props.content.description}</p>
        <a href="#" className="btn btn-primary">
          update
        </a>
      </div>
    </div>
  );
};

export default ProjectElement;
