import http from "../http-common";
import authHeader from "./auth-header";

const addCard = data => {
  let r = http.post("/tutorials/addcard", data, { headers: authHeader() });
  return r;
};

const getCards = tutorialId => {
  return http.get(`/tutorials/getcards/${tutorialId}`, { headers: authHeader() });
};

const updateCardPublishStatus = (tutorialId, data) => {
  return http.put(`/tutorials/updatecardpublishstatus/${tutorialId}`, data, { headers: authHeader() });
};

const updateCard = (tutorialId, data) => {
  return http.put(`/tutorials/updatecard/${tutorialId}`, data, { headers: authHeader() });
};

const deleteCard = (cardId, params) => {
  return http.delete(`/tutorials/deletecard/` + cardId, { headers: authHeader(), params:params });
};

const getAll = (params) => {
  let r = http.get("/tutorials", { headers: authHeader(),  params:params});
  return r;
};

const getMy = (params) => {
  let r = http.get("/tutorials/my", { headers: authHeader(), params:params});
  return r;
};

const get = id => {
  return http.get(`/tutorials/${id}`, { headers: authHeader() });
};

const create = data => {
  return http.post("/tutorials", data, { headers: authHeader() });
};

const updateOrder = (id, data) => {
  return http.put(`/tutorials/updateorder/${id}`, data, { headers: authHeader() });
};

const update = (id, data) => {
  return http.put(`/tutorials/${id}`, data, { headers: authHeader() });
};

const publish = (id, data) => {
  return http.put(`/tutorials/publish/${id}`, data, { headers: authHeader() });
};

const distribute = () => {
  return http.get(`/tutorials/distribute`, { headers: authHeader() });
};

const deleteTutorial = id => {
  return http.delete(`/tutorials/${id}`, { headers: authHeader() });
};

const findByTitle = params => {
  return http.get(`/tutorials`, { headers: authHeader(), params:params});
};

const findMyByTitle = (params) => {
  let r = http.get("/tutorials/my", { headers: authHeader(), params:params});
  return r;
};

const getCategoryArr = () => {
  return http.get(`/tutorials/getcategoryarr`, { headers: authHeader() });
};


export default {
  getAll,
  get,
  getMy,
  create,
  update,
  publish,
  distribute,
  deleteTutorial,
  findByTitle,
  findMyByTitle,
  updateOrder,
  addCard,
  getCards,
  updateCardPublishStatus,
  updateCard,
  deleteCard,
  getCategoryArr
};
