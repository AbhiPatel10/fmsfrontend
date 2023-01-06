import React, { useEffect, useState } from "react";
import "./user.css";
import { Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import { Button } from "@themesberg/react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faPlus, faTrash } from "@fortawesome/free-solid-svg-icons";
import { useHistory } from "react-router-dom";
import { Pagination } from "@material-ui/lab";
import { successToast } from "../../helper.js"
import { SkeletonUser } from '../../components/skeleton/index';
import { UserHandler, UserDeleteHandler, UserDeleteAllHandler } from "../../service/auth.service";

const User = (props) => {
    document.title = "User | FMS";
    const history = useHistory();
    const [apiUser, setApiUser] = useState([]);
    const [selectid, setSelectid] = useState([]);
    const [userid, setUserid] = useState([]);
    const [counting, setcounting] = useState(null);
    const [page, setPage] = useState(1);
    const [loading, setLoading] = useState(true);
    const [dataNotFound, setDataNotFound] = useState(false);



    const handleCheck = (event, userId) => {
        if (event.target.checked) {
            let tempData = apiUser.map(data => {
                if (data._id === userId) {
                    return { ...data, checked: true };
                } else {
                    return data;
                }
            })
            setApiUser(tempData);
            let temp = userid;
            temp.push(userId);
            setUserid(temp);
        } else {
            let tempData = apiUser.map(data => {
                if (data._id === userId) {
                    return { ...data, checked: false };
                } else {
                    return data;
                }
            })
            setApiUser(tempData);
            let temp = userid;
            const index = temp.indexOf(userId);
            temp.splice(index, 1);
            setUserid(temp);
        }
    };

    const handleselectall = (e) => {
        if (e.target.checked) {
            let temp = [];
            let tempData = apiUser.map((data) => {
                temp.push(data._id);
                return { ...data, checked: true }
            });
            setSelectid(temp)
            setApiUser(tempData);
        } else {
            let tempData = apiUser.map((data) => {
                return { ...data, checked: false };
            });
            setSelectid([])
            setApiUser(tempData);
        }
    };

    const getalldata = async () => {
        setLoading(true);
        const body = JSON.stringify({
            where: {
                isActive: "true",
            },
            pagination: {
                sortBy: "createdAt",
                descending: true,
                rowsPerPage: 5,
                page: page,
            },
        });

        const response = await UserHandler(body);
        const total = response.data.data.count;
        setcounting(Math.ceil(total / 5));
        let tempData = response.data.data.list;
        if (tempData.length > 0) {
            tempData = tempData.map((data) => ({ ...data, checked: false }));
            setLoading(false);
            setApiUser(tempData);
        } else {
            setLoading(false);
            setDataNotFound(true);
        }

    }
    useEffect(() => {
        getalldata();
        setDataNotFound(false);
    }, [page]);  // eslint-disable-line react-hooks/exhaustive-deps

    const handledit = () => {
        if (userid.length === 1) {
            history.push(`/user/${userid}/edit`);
        } else if (selectid.length > 1) {
            alert("Please Select Only One User For Edit");
        } else if (selectid.length === 0) {
            alert("Please Select One User For Edit");
        }
    };

    const deletehandle = async () => {
        if (userid.length > 0) {
            if (window.confirm("Do You Want To Delete ?")) {
                const ids = selectid.length > 0 ? selectid.join(',') : userid.join(',');
                const data = { isActive: "false" }
                const response = await UserDeleteHandler(ids, data);
                successToast(response.data.message);
                getalldata();
                setUserid([]);
                setSelectid([]);
            }

        } else if (selectid.length > 0) {
            if (window.confirm("Do You Want To Delete all Users?")) {
                const ids = selectid.length > 0 ? selectid.join(',') : userid.join(',');
                const data = { isActive: "false" }
                const response = await UserDeleteAllHandler(ids, data);
                successToast(response.data.message);
                getalldata();
                setUserid([]);
                setSelectid([]);
            }
        }
        else if (userid.length === 0) {
            alert("Please Select One user For delete");
        }
    }
    const handleChange = (event, value) => {
        setPage(value);
        setSelectid([]);
    };

    return (
        <>
            <div className="dash">
                {props.accessOption.Operations.includes('C') ? <div className="dashch mt-5">
                    <div className="child" href="#">
                        <Link to="/user/add">
                            <Button variant="primary" size="sm">
                                <FontAwesomeIcon icon={faPlus} className="me-2" /> Add New User
                            </Button>
                        </Link>
                    </div>
                </div> : ""}
                {props.accessOption.Operations.includes('U') ? <div className="dashch">
                    <div className="child" href="#">

                        <Button variant="primary" size="sm" onClick={handledit}>
                            <FontAwesomeIcon icon={faEdit} className="me-2" />
                            Edit User
                        </Button>

                    </div>
                </div> : ""}
                {props.accessOption.Operations.includes('D') ? <div className="dashch">
                    <div className="child" href="#">

                        <Button variant="primary" size="sm" onClick={deletehandle}>
                            <FontAwesomeIcon icon={faTrash} className="me-2" />
                            Delete User
                        </Button>

                    </div>
                </div> : ""}


                <table className="table m-5 table-bordered w-75">
                    <thead className="table-user">
                        <tr>
                            <th >
                                <input className="checkbox_user"
                                    checked={selectid.length > 0 ? true : false}
                                    onChange={(e) => handleselectall(e)}
                                    type="checkbox"
                                />
                            </th>
                            <th>FirstName</th>
                            <th>LastName</th>
                            <th>Email</th>
                            <th>Mobile</th>
                            <th>Role</th>
                        </tr>
                    </thead>
                    {apiUser.length > 0 && !loading &&
                        apiUser.map((users, index) => {
                            return (
                                <tbody key={`checkbox1_user ${index}`} className="table-user-body">
                                    <tr >
                                        <td>
                                            <input
                                                className="checkbox1_user"
                                                type="checkbox"
                                                checked={users.checked}
                                                onChange={(e) => handleCheck(e, users._id, users.checked)}
                                            />
                                        </td>
                                        <td> {users.first_name}</td>
                                        <td> {users.last_name}</td>
                                        <td> {users.email}</td>
                                        <td> {users.mobile}</td>
                                        <td> {users.role?.name}</td>
                                    </tr>
                                </tbody>
                            )
                        })
                    }

                    {
                        dataNotFound &&
                        <tbody className="table-role-body rounded-3">
                            <tr>
                                <td colSpan="6">
                                    Data not Founnd
                                </td>
                            </tr>
                        </tbody>
                    }

                    {loading &&
                        [1, 2, 3, 4, 5].map((users, index) => {
                            return (
                                <tbody key={`checkbox1_user ${index}`} className="table-user-body">
                                    <tr >
                                        <td>
                                            <input
                                                className="checkbox1_user"
                                                type="checkbox"
                                                checked={users.checked}
                                                onChange={(e) => handleCheck(e, users._id, users.checked)}
                                            />
                                        </td>
                                        <td>{SkeletonUser(150, 40)}</td>
                                        <td>{SkeletonUser(150, 40)}</td>
                                        <td>{SkeletonUser(150, 40)}</td>
                                        <td>{SkeletonUser(150, 40)}</td>
                                        <td>{SkeletonUser(150, 40)}</td>
                                    </tr>
                                </tbody>
                            )
                        })
                    }
                </table>
                <Pagination count={counting} onChange={handleChange} color="primary" />
            </div>
        </>
    );
};

export default User;

