import React, {useState, useEffect} from 'react';
import TutorialService from '../services/TutorialService'
//import AuthService from "../services/auth.service";

const Categories = () => {

  let [isLoading, setIsLoading] = useState(false)
  let [messageObj, setMessageObj] = useState({})
  let [categoryObj, setCategoryObj] = useState({})
  let [categoryParentAdd, setCategoryParentAdd] = useState("")

  //const currentUser = AuthService.getCurrentUser();
  //let isModerator = currentUser.roles.includes("ROLE_MODERATOR") || currentUser.roles.includes("ROLE_ADMIN")

  useEffect( () => {
    if (!isLoading) {
      setIsLoading(true)
      try {
        TutorialService.getCategories().then(response => {
          //console.log("response.data", response.data)
          setCategoryObj(response.data)
          if (response.data.totalPages === 0) {
            setMessageObj({ message: "None found. To create one, click 'Create'.", success: 0, errorObj: {} })
          } else {
            setMessageObj({ message: response.data.message, success: 1, errorObj: {} })
          }
        })
      } catch (e) {
        setIsLoading(true)
        setMessageObj({ message: "", success: 0, errorObj: e })
      }
    }
  }, [setIsLoading, isLoading])

  const createParentCategory = async (e) => {
    e.preventDefault()
    let obj = {category:categoryParentAdd}
    let r = await TutorialService.createCategory(obj)
    let newCat = r.data
    setCategoryObj({...categoryObj, newCat})
    setMessageObj("Added")
    setCategoryParentAdd("")
  }

  const handleCategoryParentEdit = (e, obj) => {
    obj.category = e.target.value
    let newObj = {}
    newObj[obj.id] = obj
    let newCategoryObj = {...categoryObj, ...newObj}
    console.log("handleCategoryParentEdit", newCategoryObj)
    setCategoryObj(newCategoryObj)
  }

  const submitParentCategoryEdit = (e, obj) => {
    e.preventDefault()
    TutorialService.updateCategory(obj).then(r => {
      setMessageObj({message:"Updated"})
    }).catch(e => {
      setMessageObj(JSON.stringify(e))
    })
  }

  const submitChildCategoryEdit = (e, obj) => {
    e.preventDefault()
    TutorialService.updateCategory(obj).then(r => {
      setMessageObj({message:"Updated"})
    }).catch(e => {
      setMessageObj(JSON.stringify(e))
    })
  }

  const handleCategoryChildAdd = (e, obj) => {
    obj.categoryChildAdd = e.target.value
    let newObj = {}
    newObj[obj.id] = {...obj}
    let newCategoryObj = {...categoryObj, ...newObj}
    setCategoryObj(newCategoryObj)
  }

  const handleCategoryChildEdit = (e, childObj) => {
    let parentId = childObj.parentId
    for(let index in categoryObj[parentId].childArr) {
      let childRowObj = categoryObj[parentId].childArr[index]
      if (childRowObj.id === childObj.id) {
        categoryObj[parentId].childArr[index].category = e.target.value
        break
      }
    }
   // console.log("handleCategoryChildEdit", categoryObj)
    setCategoryObj({...categoryObj})
  }

  const createChildCategory = async (e, obj) => {
    e.preventDefault()
    let newObj = {}
    newObj.category = obj.categoryChildAdd
    newObj.parentId = obj.id
    let r = await TutorialService.createCategory(newObj)
    let newCat = r.data
    categoryObj[obj.id].childArr.push(newCat)
    categoryObj[obj.id].categoryChildAdd = ""
    setCategoryObj(categoryObj)
    setMessageObj("Added")
  }

  //console.log("body categoryObj", categoryObj)

  // todo: delete parent, delete child, write new json to s3, have app call new json
  // double check add parent, add child, submit edit parent, submit edit child
  // wire response from be with status codes to setMessageObj in fe

  if (!isLoading) {
    return null
  }

  return (<>
    <div className="categoryMsg">{messageObj.message}</div>
    <h4>Add</h4>
    <div className="createCatForm">
      <form key={"add_form"} onSubmit={(e) => createParentCategory(e)}>
      Category Name: <input type="text" name="categoryAdd" value={categoryParentAdd}
                            onChange={(e) => setCategoryParentAdd(e.target.value)}/>
      <button className="button">Add</button>
      </form>
    </div>
    <br/>
    <h4>Edit</h4>
    {Object.values(categoryObj).map(obj => {
      return <div key={obj.id + "_cont"}>
      <form onSubmit={(e) => submitParentCategoryEdit(e, obj)}>
        <input type="text" name="categoryEdit" value={obj.category}
               onChange = {(e) => handleCategoryParentEdit(e, obj)} />
        <button>Submit</button>
        <button>Delete</button>
      </form>
      <form onSubmit = {(e) => createChildCategory(e, obj)} >
        <input type="text" name="categoryChildAdd" value={obj.categoryChildAdd}
               onChange = {(e) => handleCategoryChildAdd(e, obj)} />
        <button>Add Child Category</button>
      </form>
      <div>
      {obj.childArr.length > 0 && obj.childArr.map(childObj => {
        return <form key={childObj.id + "_child"} onSubmit = {(e) => submitChildCategoryEdit(e, obj, childObj)}>
        <input type="text" name="categoryEdit" value={childObj.category}
          onChange = {(e) => handleCategoryChildEdit(e, childObj)} />
        <button>Submit</button>
        <button>Delete</button>
        </form>
      })}
      </div>
      <hr/>
      </div>
    })}
    </>)
}

export default Categories