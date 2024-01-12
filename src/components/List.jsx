import { useContext, useEffect } from "react";
import ListItem from "./ListItem";
import { motion, AnimatePresence } from "framer-motion";
import TodosContext from "../contexts/TodosContext";
import uuid from "react-uuid";

const List = () => {
  const { listData, setListData } = useContext(TodosContext)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("https://jsonplaceholder.typicode.com/todos")
        const data = await response.json()

        const updatedListData = data.slice(0, 5).map((todo) => ({ id: todo.id, title: todo.title }))

        setListData(updatedListData)
      } catch (error) {
        console.error("Error fetching data:", error)
      }
    }

    fetchData()
  }, [setListData])

  const listAnimation = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        delayChildren: 0.3,
        staggerChildren: 0.3,
      },
    },
  }

  const itemAnimation = {
    hidden: { y: -20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
    },
  }

  return (
    <motion.ul variants={listAnimation} initial="hidden" animate="visible" id="todo">
      <AnimatePresence>
        {listData.map((item) => (
      <ListItem
        item={item.title}
        id={item.id}
        uuid={item.uuid}
        key={uuid()}
        itemAnimation={itemAnimation}
        motion={motion}
      />
        ))}
      </AnimatePresence>
    </motion.ul>
  )
}

export default List
