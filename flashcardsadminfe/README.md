TO CALL AN ENDPOINT

In services/TutorialService.js, add the method call to the endpoint based on how other functions do it. eg.
const getHintCategoryArr = () => {
    let r = http.get(`/tutorials/gethintcategoryarr`, { headers: authHeader(), params: {} });
    return r;
};
To call that endpoint, import the service into the component that wants to make the call and call the function. Pass 
in params as needed. In getHintCategoryArr, no params are needed.

