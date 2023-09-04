import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const ProjectModifier = (props) => {
  const [projectInfo, setProjectInfo] = useState({
    description: "",
    links: {
      contact: "",
      demo: "",
      repo: "",
    },
    pictures: [],
    slogan: "",
    techStack: [],
    timeline: "",
    title: "",
    type: "",
  });

  useEffect(() => {}, []);

  return (
    <div>
      <div class="mb-3">
        <label for="exampleFormControlInput1" class="form-label">
          Title
        </label>
        <input
          type="text"
          class="form-control"
          id="exampleFormControlInput1"
          value={projectInfo.title}
          onChange={(e) => {
            e.preventDefault();
            setProjectInfo({ ...projectInfo, title: e.target.value });
          }}
        />
      </div>
      <div class="mb-3">
        <label for="exampleFormControlTextarea1" class="form-label">
          Description
        </label>
        <textarea
          class="form-control"
          id="exampleFormControlTextarea1"
          rows="10"
          value={projectInfo.description}
          onChange={(e) => {
            e.preventDefault();
            setProjectInfo({ ...projectInfo, description: e.target.value });
          }}
        ></textarea>
      </div>
      <div class="mb-3">
        <label for="exampleFormControlInput2" class="form-label">
          Timeline
        </label>
        <input
          type="text"
          class="form-control"
          id="exampleFormControlInput2"
          value={projectInfo.timeline}
          onChange={(e) => {
            e.preventDefault();
            setProjectInfo({ ...projectInfo, timeline: e.target.value });
          }}
        />
      </div>
      <div class="mb-3">
        <label for="exampleFormControlInput3" class="form-label">
          Slogan
        </label>
        <input
          type="text"
          class="form-control"
          id="exampleFormControlInput3"
          value={projectInfo.slogan}
          onChange={(e) => {
            e.preventDefault();
            setProjectInfo({ ...projectInfo, slogan: e.target.value });
          }}
        />
      </div>
      <div class="mb-3">
        <label for="exampleFormControlInput5" class="form-label">
          Tech Stacks (Separate with commas)
        </label>
        <input
          type="text"
          class="form-control"
          id="exampleFormControlInput5"
          value={projectInfo.techStack.join(",")}
          onChange={(e) => {
            e.preventDefault();
            setProjectInfo({
              ...projectInfo,
              techStack: e.target.value.split(","),
            });
          }}
        />
      </div>
      <div class="mb-3">
        <h3>Links</h3>
        <label for="exampleFormControlInput6" class="form-label">
          Contact
        </label>
        <input
          type="text"
          class="form-control"
          id="exampleFormControlInput6"
          value={projectInfo.links.contact}
          onChange={(e) => {
            e.preventDefault();
            setProjectInfo({
              ...projectInfo,
              links: { ...projectInfo.links, contact: e.target.value },
            });
          }}
        />
        <label for="exampleFormControlInput7" class="form-label">
          Demo
        </label>
        <input
          type="text"
          class="form-control"
          id="exampleFormControlInput7"
          value={projectInfo.links.demo}
          onChange={(e) => {
            e.preventDefault();
            setProjectInfo({
              ...projectInfo,
              links: { ...projectInfo.links, demo: e.target.value },
            });
          }}
        />
        <label for="exampleFormControlInput8" class="form-label">
          Repo
        </label>
        <input
          type="text"
          class="form-control"
          id="exampleFormControlInput8"
          value={projectInfo.links.repo}
          onChange={(e) => {
            e.preventDefault();
            setProjectInfo({
              ...projectInfo,
              links: { ...projectInfo.links, repo: e.target.value },
            });
          }}
        />
      </div>
      <div class="mb-3">
        <label for="exampleFormControlInput9" class="form-label">
          Project Status
        </label>
        <select
          class="form-select"
          aria-label="Default select example"
          onChange={(e) => {
            e.preventDefault();
            setProjectInfo({ ...projectInfo, type: e.target.value });
          }}
        >
          <option selected={projectInfo.type === "past"} value="past">
            Past
          </option>
          <option selected={projectInfo.type === "active"} value="active">
            Ongoing
          </option>
        </select>
      </div>
      <button type="submit" class="btn btn-primary">
        Submit
      </button>
    </div>
  );
};

export default ProjectModifier;
