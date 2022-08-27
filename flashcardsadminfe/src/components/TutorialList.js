import React, { useState, useEffect } from "react";
import TutorialDataService from "../services/TutorialService";
import { Link } from "react-router-dom";
import Pagination from "@material-ui/lab/Pagination";
import configs from "../configs"
import Message from "./Message";
import AuthService from "../services/auth.service";

const TutorialList = ({props}) => {

  const [isLoaded, setIsLoaded] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [count, setCount] = useState(0);// totalPages
  const [pageSize, setPageSize] = useState(5);
  const pageSizes = [5, 10, 15, 20];
  const [page, setPage] = useState(1);
  const [tutorials, setTutorials] = useState([]);
  const [messageObj, setMessageObj] = useState({message:"", success:0, errorObj:{}});
  const [searchTitle, setSearchTitle] = useState("");
  const [tutorialListContStyle, setTutorialListContStyle] = useState({display:"block"});

  const [my, setMy] = useState(props.my);
  const [all, setAll] = useState(props.all);
  const [unpublishedOnly, setUnpublishedOnly] = useState(props.unpublishedOnly);
  const [undistributedOnly, setUndistributedOnly] = useState(props.undistributedOnly);

  const setIsLoadToFalse = () => {
    setIsLoaded(false);
    setIsLoading(false);
  }

  if (my !== props.my) {
    setMy(props.my);
    setIsLoadToFalse();
    setPage(1);
  }
  if (all !== props.all) {
    setAll(props.all);
    setIsLoadToFalse();
    setPage(1);
  }
  if (unpublishedOnly !== props.unpublishedOnly) {
    setUnpublishedOnly(props.unpublishedOnly);
    setIsLoadToFalse();
    setPage(1);
  }
  if (undistributedOnly !== props.undistributedOnly) {
    setUndistributedOnly(props.undistributedOnly);
    setIsLoadToFalse();
    setPage(1);
  }

  const clearSearch = () => {
    setSearchTitle('');
    setIsLoadToFalse();
  }

  function getRequestParams (searchTitle, page, pageSize, unpublishedOnly, undistributedOnly) {
    let params = {};
    if (searchTitle) {
      params["title"] = searchTitle;
    }
    if (page) {
      params["page"] = page - 1;
    }
    if (pageSize) {
      params["size"] = pageSize;
    }
    if (unpublishedOnly) {
      params['published'] = 0;
    } else if (undistributedOnly) {
      params['published'] = 1;
    }
    return params;
  };

  const handlePageChange = (event, value) => {
    setPage(value);
    setIsLoadToFalse();
  };

  const handlePageSizeChange = (event) => {
    setPageSize(event.target.value);
    setIsLoadToFalse();
    setPage(1);
  };

  useEffect( () => {
    const retrieveTutorials = async () => {
      setIsLoading(true);
      const params = getRequestParams(searchTitle, page, pageSize, unpublishedOnly, undistributedOnly);
      let response = {};
      try {
        if (my) {
          response = await TutorialDataService.getMy(params);
        } else {
          response = await TutorialDataService.getAll(params);
        }
        console.log(response.data.tutorials)
        setTutorials(response.data.tutorials);
        setCount(response.data.totalPages);
        setIsLoaded(true);
        setIsLoading(false);
        setTutorialListContStyle({display:"block"});
        if (response.data.totalPages === 0) {
          setMessageObj({message:"None found. To create one, click 'Create' in the header above.", success:0,errorObj:{}});
        } else {
          setMessageObj({message:response.data.message, success:1, errorObj:{}});
        }
      } catch(e) {
        setIsLoaded(true);
        setIsLoading(true);
        setMessageObj({message:"", success:0, errorObj:e});
      };

    };
    if (!isLoading && !isLoaded) {
      retrieveTutorials();
    }
  }, [ my, page, pageSize, searchTitle, unpublishedOnly, all, undistributedOnly, isLoaded, isLoading]);

  const onChangeSearchTitle = e => {
    const searchTitle = e.target.value;
    setSearchTitle(searchTitle);
  };

  const findByTitle = async () => {

    let params = getRequestParams(searchTitle, page, pageSize);
    let response = {};
    try {
      if (my) {
        response = await TutorialDataService.findMyByTitle(params);
      } else {
        response = await TutorialDataService.findByTitle(params);
      }
    } catch(e) {
      setMessageObj({message:"", success:0, errorObj:e});
    };
    const { tutorials, totalPages } = response.data;
    setTutorials(tutorials);
    setCount(totalPages);
    setIsLoaded(true);
  };

  const distribute = (event) => {
    event.preventDefault();
    TutorialDataService.distribute()
    .then(response => {
      setTutorialListContStyle({display:"none"});
      setMessageObj({message:response.data.message, success:1, errorObj:{}});
    })
    .catch(e => {
      setMessageObj({message:"", success:0, errorObj:e});
    });
  };

  const getTitle = () => {
    if (my) {
      return "My FlashCards";
    } else if (unpublishedOnly) {
      return "FlashCards Unpublished";
    } else if (undistributedOnly) {
      return "FlashCards Undistributed";
    }
    return "All FlashCards";
  }

  const currentUser = AuthService.getCurrentUser();
  let isModerator = currentUser.roles.includes("ROLE_MODERATOR") || currentUser.roles.includes("ROLE_ADMIN");

  if (!isLoaded) {
    return null;
  } else if (messageObj?.success === 0) {
    return <div>
      <Message messageObj={messageObj} />
      <div style={{clear:"both"}} />
      </div>
  } else {

      return <div>
      {/*<div>*/}
      {/*<Message messageObj={messageObj} />*/}
      {/*<div style={{clear:"both"}} />*/}
      {/*</div>*/}
      <div className="list row">
      <div className="col-md-8">
        <div className="input-group mb-3">
          <input
            type="text"
            className="form-control"
            placeholder="Search by title"
            value={searchTitle}
            onChange={onChangeSearchTitle}
          />
          <div className="input-group-append">
            <button
              className="btn btn-outline-secondary"
              type="button"
              onClick={findByTitle}
            >
              Search
            </button>
            &nbsp;
            <button
              className="btn btn-outline-secondary"
              type="button"
              onClick={clearSearch}
            >
              Clear
            </button>
          </div>
        </div>
      </div>
      <div className="col-md-12">
        <h4>
          {getTitle()}
          <div
            style={undistributedOnly ? ({display:"block"}) : ({display:"none"})}
            className='distributeOnlyBtnCont'
          >
          <button
            type='button'
            className='btn btn-success distributeBtn'
            onClick={(e) => { window.confirm('Make all published tutorials accessible via the public categories list?') && distribute(e)}}
          >Distribute</button>
          <div className="distributeOnlyBtnInfo">Only tutorials that have been Published appear here. Click Distribute to make all Published tutorials accessible via the <a
            rel="noopener noreferrer"
            href={configs.flashcardsappurl}
            target="_blank"
          >public categories list</a>, not just the 'Take' button.
          </div>
            <div style={{clear:"both"}} />
          </div>
        </h4>
        <div style={{clear:"both"}} />

        <div style={messageObj.success === 1 ? ({marginTop:"20px"}) : ("")}>
          <Message messageObj={messageObj} />
          <div style={{clear:"both"}} />
        </div>

        <div style={tutorialListContStyle}>
        <div className="mt-3">
          {"Items per Page: "}
          <select onChange={handlePageSizeChange} value={pageSize}>
            {pageSizes.map((size) => (
              <option key={size} value={size}>
                {size}
              </option>
            ))}
          </select>

          <Pagination
            className="my-3"
            count={count}
            page={page}
            siblingCount={1}
            boundaryCount={1}
            variant="outlined"
            shape="rounded"
            onChange={handlePageChange}
          />
        </div>

        <ul className="list-group listCont">
          {tutorials &&
            tutorials.map((tutorial, index) => (
            <li
                className={
                  "list-group-item"
                }
                key={index}
              >
                <div >
                <span className="listTitle">{tutorial.title}</span> by {tutorial.user.username} ({tutorial.numCards} cards) in
                <br />
                  {tutorial.parentCategory}: {tutorial.category}
                <br />
                <div className="listDesc">
                  {tutorial.description}
                </div>
                <br />
                  {tutorial.published === 1 ? "Published" : (tutorial.published === 2 ? "Distributed" : "Unpublished")}
                  {tutorial.published === 2 && !isModerator ? (" - no further edits may be done.") : ("")}
                </div>

                <div className="listEditBtnCont">
                <Link
                  to={"/tutorials/" + tutorial.id}
                  className="btn btn-secondary listEditBtn"
                >
                  {(my && tutorial.published !==2) || isModerator ? ("Edit") : ("View")}
                </Link>
                </div>

                <div className="listTakeBtnCont">
                  {tutorial.published ? (
                    <a
                      rel="noopener noreferrer"
                      className="btn btn-primary listTakeBtn"
                      href={configs.flashcardsappurl + tutorial.id.toString()}
                      target="_blank"
                    >
                      Take
                    </a>
                  ) : ("")}
                </div>
              </li>
            ))}
        </ul>

      </div>
    </div>
    </div>
    </div>
  }

}

export default TutorialList;
