import { getAuth } from 'firebase/auth'
import { FC, useEffect } from 'react'
import InitialBoardList from '../components/InitialList'
import BoardList from '../components/List'
import { useAppDispatch, useAppSelector } from '../hooks/reduxHooks'
import { addNewList, addNewtask, boardSelector, deleteList, fetchData } from '../store/slices/boardSlice'
import { ListType } from '../types'
import { useAuthState } from 'react-firebase-hooks/auth'
import { doc, setDoc } from 'firebase/firestore'
import db from '../firebase'
import Loader from '../components/Loader'

const Board: FC = () => {
    const { boardLists, listCounter, taskCounter, loadingStatus } = useAppSelector(boardSelector)

    const dispatch = useAppDispatch()
    const auth = getAuth()

    const [user, loading, error] = useAuthState(auth)

    const onAddNewList = () => {
        dispatch(addNewList())
    }

    const onDeleteList = (id: number) => {
        dispatch(deleteList(id))
    }

    const onAddTask = (listId: number) => {
        dispatch(addNewtask(listId))
    }

    useEffect(() => {
        if (user) {
            dispatch(fetchData(user?.uid))
        }
    }, [])

    const postData = async () => {
        if (listCounter) {
            const docRef = doc(db, 'boardData', `${user?.uid}`)
            const payload = { boardLists, listCounter, taskCounter }

            await setDoc(docRef, payload)
        }
    }

    useEffect(() => {
        postData()
    }, [boardLists])

    return (
        <div className="board">
            {loadingStatus === 'success' ? (
                <div className="board__container container">
                    {boardLists.map((obj: ListType) => (
                        <BoardList
                            id={obj.id}
                            title={obj.title}
                            tasks={obj.tasks}
                            key={obj.id}
                            onDeleteList={onDeleteList}
                            onAddTask={onAddTask}
                        />
                    ))}

                    <InitialBoardList onAddNewList={onAddNewList} />
                </div>
            ) : (
                <Loader />
            )}
        </div>
    )
}

export default Board