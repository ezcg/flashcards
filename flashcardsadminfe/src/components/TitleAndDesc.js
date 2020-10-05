import CharCounter
  from "./CharCounter";
import configs
  from "../configs";
import React
  from "react";

export default function TitleAndDesc({tutorial, handleInputChange}) {

  return <div>
  <div className="form-group">
    <label htmlFor="title">Title</label>
    <input
      type="text"
      className="form-control titleField"
      id="title"
      required
      value={tutorial.title}
      onChange={handleInputChange}
      name="title"
    />
    <CharCounter maxChars={configs.maxCharsTitle} chars={tutorial.title} />
  </div>
  <br />

  <div className="form-group">
    <label htmlFor="description">Description</label>
    <input
      type="text"
      className="form-control descriptionField"
      id="description"
      required
      value={tutorial.description}
      onChange={handleInputChange}
      name="description"
    />
    <CharCounter maxChars={configs.maxCharsDescription} chars={tutorial.description} />

  </div>
  </div>
}
