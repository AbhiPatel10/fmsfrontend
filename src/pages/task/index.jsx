import React, { useEffect, useState } from "react";
import './task.css';
import { Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import { Button } from "@themesberg/react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faPlus, faTrash } from "@fortawesome/free-solid-svg-icons";
import { Pagination } from "@material-ui/lab";
import { useHistory } from "react-router-dom";
import { SkeletonTask } from '../../components/skeleton/index';
import { TaskHandler, TaskDeleteHandler, TaskDeleteAllHandler } from "../../service/auth.service";
import { successToast } from "../../helper.js"

const Task = (props) => {
    document.title = "Task | FMS";
    const history = useHistory();
    const [apiTask, setApiTask] = useState([]);
    const [counting, setcounting] = useState(null);
    const [page, setPage] = useState(1);
    const [selectid, setSelectid] = useState([]);
    const [loading, setLoading] = useState(true);
    const [taskid, setTaskid] = useState([]);
    const [dataNotFound, setDataNotFound] = useState(false);

    const handleCheck = (event, roleId, checked) => {
        if (event.target.checked) {
            let tempData = apiTask.map(data => {
                if (data._id === roleId) {
                    return { ...data, checked: true };
                } else {
                    return data;
                }
            })
            setApiTask(tempData);
            let temp = taskid;
            temp.push(roleId);
            setTaskid(temp);
        } else {
            let tempData = apiTask.map(data => {
                if (data._id === roleId) {
                    return { ...data, checked: false };
                } else {
                    return data;
                }
            })
            setApiTask(tempData);

            let temp = taskid;
            const index = temp.indexOf(roleId);
            temp.splice(index, 1);
            setTaskid(temp);
        }
    };
    const handleselectall = (e) => {
        if (e.target.checked) {
            let temp = [];
            let tempData = apiTask.map((data) => {
                temp.push(data._id);
                return { ...data, checked: true }
            });
            setSelectid(temp)
            setApiTask(tempData);
        } else {
            let tempData = apiTask.map((data) => {
                return { ...data, checked: false };
            });
            setSelectid([])
            setApiTask(tempData);
        }
    };

    const getalldata = async () => {
        setLoading(true);
        const body = JSON.stringify({
            where: {
                isActive: "true",
                // AssignTo: localStorage.getItem("id"),
            },
            pagination: {
                sortBy: "createdAt",
                descending: true,
                rowsPerPage: 5,
                page: page,
            },
        });
        const response = await TaskHandler(body);
        const total = response.data.data.count;
        setcounting(Math.ceil(total / 5));

        let tempData = response.data.data.list;
        if (tempData.length > 0) {
            tempData = tempData.map((data) => ({ ...data, checked: false }));
            setLoading(false);
            setApiTask(tempData);
        } else {
            setLoading(false);
            setDataNotFound(true);
        }
    };
    useEffect(() => {
        getalldata();
        setDataNotFound(false);
    }, [page]);  // eslint-disable-line react-hooks/exhaustive-deps

    const handledit = () => {
        if (taskid.length === 1) {
            history.push(`/task/${taskid}/edit`);
        } else if (selectid.length > 1) {
            alert("Please Select Only One task For Edit");
        } else if (selectid.length === 0) {
            alert("Please Select One task For Edit");
        }
    };

    const deletehandle = async () => {
        if (taskid.length > 0) {
            if (window.confirm("Do You Want To Delete ?")) {
                const ids = selectid.length > 0 ? selectid.join(',') : taskid.join(',');
                const data = { isActive: "false" }
                const response = await TaskDeleteHandler(ids, data);
                successToast(response.data.message);
                getalldata();
                setTaskid([]);
                setSelectid([]);
            }
        }
        if (selectid.length > 0) {
            if (window.confirm("Do You Want To Delete all Tasks?")) {
                const ids = selectid.length > 0 ? selectid.join(',') : taskid.join(',');
                const data = { isActive: "false" }
                const response = await TaskDeleteAllHandler(ids, data);
                successToast(response.data.message);
                getalldata();
                setTaskid([]);
                setSelectid([]);
            }
        }
        else if (taskid.length === 0) {
            alert("Please Select One task For delete");
        }
    };
    const handleChange = (event, value) => {
        setPage(value);
        setSelectid([]);
    };

    return (
        <>
            <div className="dash">
                {props.accessOption.Operations.includes('C') ? <div className="dashch mt-5">
                    <div className="child" href="#">
                        <Link to="/task/add">
                            <Button variant="primary" size="sm">
                                <FontAwesomeIcon icon={faPlus} className="me-2" /> Add New Task
                            </Button>
                        </Link>
                    </div>
                </div> : ""}
                {props.accessOption.Operations.includes('U') ? <div className="dashch">
                    <div className="child" href="#">
                        <Button variant="primary" size="sm" onClick={handledit} >
                            <FontAwesomeIcon icon={faEdit} className="me-2" />
                            Edit Task
                        </Button>
                    </div>
                </div> : ""}
                {props.accessOption.Operations.includes('D') ? <div className="dashch mt-5">
                    <div className="child" href="#">
                        <Button variant="primary" size="sm" onClick={deletehandle}>
                            <FontAwesomeIcon icon={faTrash} className="me-2" />
                            Delete Task
                        </Button>
                    </div>
                </div> : ""}
                <table className="table m-5 table-bordered w-auto">
                    <thead className="table-task">
                        <tr>
                            <th>
                                <input className="checkbox_task" checked={selectid.length > 0 ? true : false} onChange={(e) => handleselectall(e)} type="checkbox" />
                            </th>
                            <th scope="col" >Task</th>
                            <th scope="col">Project</th>
                            <th scope="col">Description</th>
                            <th scope="col">Status</th>
                            <th scope="col">Comments</th>
                            <th scope="col">AssignBy</th>
                            <th scope="col">assignTo</th>
                            <th scope="col">Expected Time</th>
                            <th scope="col">Real Time</th>
                        </tr>
                    </thead>
                    {apiTask.length > 0 && !loading &&
                        apiTask.map((tasks, index) => {
                            return (
                                <tbody key={`checkbox1_task ${index}`} className="table-task-body">
                                    <tr>
                                        <td> <input
                                            className="checkbox1_task"
                                            type="checkbox"
                                            checked={tasks.checked}
                                            onChange={(e) => handleCheck(e, tasks._id, tasks.checked)}
                                        /></td>
                                        <td> {tasks.name}</td>
                                        <td> {tasks.project_id.name}</td>
                                        <td> {tasks.description}</td>
                                        <td> {tasks.status}</td>
                                        <td> {tasks.comments}</td>
                                        <td> {tasks.AssignBy != null ? tasks.AssignBy.first_name : "null"}</td>
                                        <td> {tasks.AssignTo != null ? tasks.AssignTo.first_name : "null"}</td>
                                        <td> {tasks.Duration?.Exception}</td>
                                        <td> {tasks.Duration?.Realtime}</td>
                                    </tr>
                                </tbody>
                            )
                        })}
                    {
                        dataNotFound &&
                        <tbody className="table-role-body rounded-3">
                            <tr>
                                <td colSpan="10">
                                    Data not Founnd
                                </td>
                            </tr>
                        </tbody>
                    }
                    {loading &&
                        [1, 2, 3, 4, 5].map((tasks, index) => {
                            return (
                                <tbody key={`checkbox ${index}`} className="table-task-body">
                                    <tr >

                                        <td> <input
                                            className="checkbox1_task"
                                            type="checkbox"
                                            checked={tasks.checked}
                                            onChange={(e) => handleCheck(e, tasks._id, tasks.checked)}
                                        /></td>
                                        <td>{SkeletonTask(80, 40)}</td>
                                        <td>{SkeletonTask(80, 40)}</td>
                                        <td>{SkeletonTask(80, 40)}</td>
                                        <td>{SkeletonTask(80, 40)}</td>
                                        <td>{SkeletonTask(80, 40)}</td>
                                        <td>{SkeletonTask(80, 40)}</td>
                                        <td>{SkeletonTask(80, 40)}</td>
                                        <td>{SkeletonTask(80, 40)}</td>
                                        <td>{SkeletonTask(80, 40)}</td>
                                    </tr>
                                </tbody>
                            )
                        })
                    }


                </table>
                <Pagination onChange={handleChange} count={counting} />
            </div>
        </>
    );
};

export default Task;

