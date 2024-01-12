import { useEffect, useRef, useState } from "react";
import "./App.css";
import Header from "./components/Header";
import Input from "./components/Input";
import List from "./components/List";
import TodosContext from "./contexts/TodosContext";

function App() {
  const [listData, setListData] = useState([])
  const firstRender = useRef(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("https://jsonplaceholder.typicode.com/todos")
        const data = await response.json()
        setListData(data.slice(0, 5))
      } catch (error) {
        console.error("Error fetching data:", error)
      }
    }

    fetchData()
  }, [])

  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false
      return
    }
   
    const saveData = async () => {
      try {
        await fetch("https://jsonplaceholder.typicode.com/todos", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(listData),
        })
      } catch (error) {
        console.error("Error saving data:", error)
      }
    }

    saveData()
  }, [listData])

  return (
    <TodosContext.Provider value={{ listData, setListData }}>
      <Header />
      <Input />
      <List />
    </TodosContext.Provider>
  )
}

export default App
