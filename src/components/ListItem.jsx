import { useContext, useEffect, useRef, useState } from "react";
import TodosContext from "../contexts/TodosContext";

const ListItem = ({ item, id, uuid, motion, itemAnimation }) => {
  const [editMode, setEditMode] = useState(false)
  const [itemText, setItemText] = useState(item)
  const inputRef = useRef(null)
  const { listData, setListData } = useContext(TodosContext)

  const handleRemove = async () => {
    try {

      const response = await fetch(`https://jsonplaceholder.typicode.com/todos/${uuid}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        console.error("Failed to delete item. Status:", response.status)
        return
      }

      const indexToRemove = listData.findIndex((data) => data.uuid === uuid)

      if (indexToRemove !== -1) {
        const newListData = [...listData.slice(0, indexToRemove), ...listData.slice(indexToRemove + 1)]
        setListData(newListData)
      } else {
        console.error("Item with uuid not found in listData")
      }
    } catch (error) {
      console.error("Error removing task:", error)
    }
  };

  const handleEdit = () => {
    setEditMode(!editMode)
  }

  const handleChange = (e) => {
    setItemText(e.target.value)
  }

  const handleKeyDown = async (e) => {
    if (e.key === "Enter") {
      const updatedText = inputRef.current.value;
      setEditMode(false)
      
      try {
  
        const response = await fetch(`https://jsonplaceholder.typicode.com/todos/${id}`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ title: updatedText }),
        })
  
        if (!response.ok) {
          console.error("Failed to update item. Status:", response.status)
          return
        }
  
        setItemText(updatedText)
      } catch (error) {
        console.error("Error updating task:", error)
      }
    }
  }

  useEffect(() => {
    if (editMode) {
      inputRef.current.focus()
    }
  }, [editMode])

  return (
    <motion.li className="list-item" variants={itemAnimation} layout="position" key={id}>
      <div className={editMode ? "text hidden" : "text"}>{itemText}</div>
      <textarea
        ref={inputRef}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        className={editMode ? "" : "hidden"}
        type="text"
        value={itemText}
      />
      <div className="buttons">
        <button className="edit" onClick={handleEdit}>
          <i className="fa-solid fa-edit"></i>
        </button>

        <button className="remove" onClick={handleRemove}>
          <i className="fa-solid fa-trash"></i>
        </button>
      </div>
    </motion.li>
  )
}

export default ListItem;
