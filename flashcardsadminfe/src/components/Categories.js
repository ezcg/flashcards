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

  const createParentCategory = (e) => {
    e.preventDefault()
    let obj = {category:categoryParentAdd}
    TutorialService.createCategory(obj).then(r => {
      let newCat = r.data
      categoryObj[newCat.id] = newCat
      setCategoryObj(categoryObj)
      setMessageObj("Added")
      setCategoryParentAdd("")
    }).catch(e => {
      setMessageObj({message:e.response.data.message})
    })
  }

  const handleCategoryParentEdit = (e, obj) => {
    obj.category = e.target.value
    let newObj = {}
    newObj[obj.id] = obj
    let newCategoryObj = {...categoryObj, ...newObj}
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
    setCategoryObj({...categoryObj})
  }

  const createChildCategory = async (e, obj) => {
    e.preventDefault()
    obj.categoryChildAdd = obj.categoryChildAdd.trim()
    if (obj.categoryChildAdd === "") {
      setMessageObj({message:"Child category was empty and not added."})
    } else {
      let newObj = {}
      newObj.category = obj.categoryChildAdd
      newObj.parentId = obj.id
      let r = await TutorialService.createCategory(newObj)
      let newCat = r.data
      categoryObj[obj.id].childArr.push(newCat)
      categoryObj[obj.id].categoryChildAdd = ""
      setCategoryObj(categoryObj)
      setMessageObj({ message: "Added" })
    }
  }

  const deleteParentCategory = async (e, obj) => {
    e.preventDefault()
    if (window.confirm('Are you sure you wish to delete this parent category and any children directly beneath it?')) {
      let newObj = {id:obj.id, parentId:obj.parentId}
      let r = await TutorialService.deleteCategory(newObj)
      if (r.status === 200) {
        delete categoryObj[obj.id]
        setCategoryObj(categoryObj)
        setMessageObj({message:"Deleted"})
      }
    }
  }

  const deleteChildCategory = async (e, childObj) => {
    e.preventDefault()
    if (window.confirm('Are you sure you wish to delete this child category?')) {
      let newObj = {id:childObj.id}
      let r = await TutorialService.deleteCategory(newObj)
      if (r.status === 200) {
        for(let i in categoryObj[childObj.parentId].childArr) {
          if (categoryObj[childObj.parentId].childArr[i].id === childObj.id) {
            delete categoryObj[childObj.parentId].childArr[i]
            break
          }}
        setCategoryObj(categoryObj)
        setMessageObj({message:"Deleted"})
      }
    }
  }

  const deployCategories = async (e) => {
    e.preventDefault()
    if (window.confirm('Are you sure you wish to make these categories live?')) {
      TutorialService.deployCategoriesJson().then(r => {
        setMessageObj({message:"Deployed."})
      }).catch(e => {
        setMessageObj({message:JSON.stringify(e)})
      })
    }
  }

  if (!isLoading) {
    return null
  }

  return (<>
    <div className="deployCatCont"><button className='btn btn-primary' onClick = {(e) => deployCategories(e)}>Deploy</button> categories to S3</div>
    <div className="categoryMsg">{messageObj.message}</div>
    <h4>Add</h4>
    <div className="createCatForm">
      <form
        key={"add_form"}
        onSubmit={(e) => createParentCategory(e)}
      >
      Category Name: <input
        type="text"
        name="categoryAdd"
        value={categoryParentAdd}
        onChange={(e) => setCategoryParentAdd(e.target.value)}
      />
      <button className="addCategoryBtn btn btn-primary">Add</button>
      </form>
    </div>
    <br/>
    <h4>Edit</h4>
    {Object.values(categoryObj).map(obj => {
      return <div key={obj.id + "_cont"}>
      <form
        className="parentCategoryEdit"
        onSubmit={(e) => submitParentCategoryEdit(e, obj)}
      >
        <input
          className="parentCategoryEditField"
          type="text"
          name="parentCategoryEdit"
          value={obj.category}
          onChange = {(e) => handleCategoryParentEdit(e, obj)}
        />
        <button className="submitCategoryBtn btn btn-secondary">Submit</button>
        <span
          className="deleteCategoryBtn btn btn-danger"
          onClick = {(e) =>deleteParentCategory(e, obj)}
        >Delete</span>
      </form>

      <form
        className="createChildCategory"
        onSubmit = {(e) => createChildCategory(e, obj)}
      >
        <input
          type="text"
          name="categoryChildAdd"
          value={obj.categoryChildAdd}
          onChange = {(e) => handleCategoryChildAdd(e, obj)}
        />
        <button className="createChildCategoryBtn btn btn-primary">Add Child Category</button>
      </form>
      <div>
      {obj.childArr.length > 0 && obj.childArr.map(childObj => {
        return <form
          className="childCategoryEdit"
          key={childObj.id + "_child"}
          onSubmit = {(e) => submitChildCategoryEdit(e, obj, childObj)}
        >
          <input
            type="text"
            name="childCategoryEdit"
            value={childObj.category}
            onChange = {(e) => handleCategoryChildEdit(e, childObj)}
          />
          <button className="submitCategoryBtn btn  btn-secondary">Submit</button>
          <span
            className="deleteCategoryBtn btn btn-danger"
            onClick = {(e) => deleteChildCategory(e, childObj)}
          >Delete</span>
        </form>
      })}
      </div>
      <hr className="categoryHr"/>
      </div>
    })}
    </>)
}

export default Categories