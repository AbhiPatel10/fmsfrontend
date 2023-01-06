import React, { useEffect, useState } from "react";
import "./role.css";
import { Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import { Button } from "@themesberg/react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faEdit,
  faPlus,
  faTrash,
} from "@fortawesome/free-solid-svg-icons";
import { useHistory } from "react-router-dom";
import { Pagination } from "@material-ui/lab";
import { SkeletonRole } from '../../components/skeleton/index';
import { RoleHandler, RoleDeleteHandler, RoleDeleteAllHandler } from "../../service/auth.service";
import { successToast } from "../../helper.js"

const Role = (props) => {
  document.title = "Role | FMS";
  const history = useHistory();
  const [ApiData, setApiData] = useState([]);
  const [roleid, setRoleid] = useState([]);
  const [dataNotFound, setDataNotFound] = useState(false);
  const [selectid, setSelectid] = useState([]);
  const [counting, setcounting] = useState(null);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);

  const handleselectall = (e) => {
    if (e.target.checked) {
      let temp = [];
      let tempData = ApiData.map((data) => {
        temp.push(data._id);
        return { ...data, checked: true };
      });
      setSelectid(temp);
      setApiData(tempData);
    } else {
      let tempData = ApiData.map((data) => {
        return { ...data, checked: false };
      });
      setSelectid([]);
      setApiData(tempData);
    }
  };

  const handleCheck = (event, roleId) => {
    if (event.target.checked) {
      let tempData = ApiData.map((data) => {
        if (data._id === roleId) {
          return { ...data, checked: true };
        } else {
          return data;
        }
      });
      setApiData(tempData);

      let temp = roleid;
      temp.push(roleId);
      setRoleid(temp);
    } else {
      let tempData = ApiData.map((data) => {
        if (data._id === roleId) {
          return { ...data, checked: false };
        } else {
          return data;
        }
      });
      setApiData(tempData);

      let temp = roleid;
      const index = temp.indexOf(roleId);
      temp.splice(index, 1);
      setRoleid(temp);
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

    const response = await RoleHandler(body);
    const total = response.data.data.count;

    setcounting(Math.ceil(total / 5));

    let tempData = response.data.data.list;
    if (tempData.length > 0) {
      tempData = tempData.map((data) => ({ ...data, checked: false }));

      setLoading(false);
      setApiData(tempData);
    } else {
      setLoading(false);
      setDataNotFound(true);
    }
  };
  useEffect(() => {
    getalldata();
    setDataNotFound(false);
  }, [page])  // eslint-disable-line react-hooks/exhaustive-deps

  const handledit = () => {
    if (roleid.length === 1) {
      history.push(`/role/${roleid}/edit`);
    } else if (selectid.length > 1) {
      alert("Please Select Only One Role For Edit");
    } else if (selectid.length === 0) {
      alert("Please Select One Role For Edit");
    }
  };

  const deletehandle = async () => {

    if (roleid.length > 0) {
      if (window.confirm("Do You Want To Delete ?")) {
        const ids = selectid.length > 0 ? selectid.join(",") : roleid.join(",");
        const data = { isActive: "false" }
        const response = await RoleDeleteHandler(ids, data);
        successToast(response.data.message);
        getalldata();
        setSelectid([]);
        setRoleid([]);
      }
    }


    if (selectid.length > 0) {
      if (window.confirm("Do You Want To Delete all Roles ?")) {

        const ids = selectid.length > 0 ? selectid.join(",") : roleid.join(",");
        const data = { isActive: "false" }
        const response = await RoleDeleteAllHandler(ids, data);
        successToast(response.data.message);
        getalldata();
        setSelectid([]);
        setRoleid([]);
      }

    }
    else if (roleid.length === 0) {
      alert("Please Select One role For delete");
    }
  };

  const handleChange = (event, value) => {
    setPage(value);
    setSelectid([]);
  };

  return (
    <>
      <div className="dash pt-5 ">
        {props.accessOption.Operations.includes("C") ? (
          <div className="dashch">
            <div className="child" href="#">
              <Link to="/role/add">
                <Button size="sm">
                  <FontAwesomeIcon icon={faPlus} className="me-2" /> Add New
                  Role
                </Button>
              </Link>
            </div>
          </div>
        ) : (
          ""
        )}
        {props.accessOption.Operations.includes("U") ? (
          <div className="dashch">
            <div className="child" href="#">
              <Button size="sm" onClick={handledit}>
                <FontAwesomeIcon icon={faEdit} className="me-2" />
                Edit Role
              </Button>
            </div>
          </div>
        ) : (
          ""
        )}
        {props.accessOption.Operations.includes("D") ? (
          <div className="dashch">
            <div className="child" href="#">
              <Button size="sm" onClick={deletehandle}>
                <FontAwesomeIcon icon={faTrash} className="me-2" />
                Delete Role
              </Button>
            </div>
          </div>
        ) : (
          ""
        )}

        <table className="table m-5 table-bordered w-25" >
          <thead className="table-role">
            <tr>
              <th>
                <input
                  className="checkbox_role"
                  checked={selectid.length > 0 ? true : false}
                  onChange={(e) => handleselectall(e)}
                  type="checkbox"
                />
              </th>
              <th scope="col">Role</th>
            </tr>
          </thead>
          {ApiData && ApiData.length > 0 &&
            !loading &&
            ApiData.map((roles, index) => {
              return (
                <tbody key={`checkbox1_role ${index}`} className="table-role-body rounded-3">
                  <tr >
                    <td>
                      <input
                        className="checkbox1_role"
                        type="checkbox"
                        checked={roles.checked}
                        onChange={(e) => handleCheck(e, roles._id)}
                      />
                    </td>
                    <td>{roles.name}</td>
                  </tr>
                </tbody>
              );
            })}

          {
            dataNotFound &&
            <tbody className="table-role-body rounded-3">
              <tr>
                <td colSpan="2">
                  Data not Founnd
                </td>
              </tr>
            </tbody>
          }

          {loading &&
            [1, 2, 3, 4, 5].map((roles, index) => {
              return (
                <tbody key={`checkbox${index}`} className="table-role-body rounded-3">
                  <tr >
                    <td>
                      <input
                        className="checkbox1_role"
                        type="checkbox"
                        checked={roles.checked}
                        onChange={(e) => handleCheck(e, roles._id)}
                      />
                    </td>
                    <td>{SkeletonRole(220, 50)}</td>
                  </tr>
                </tbody>
              );
            })}

        </table>


        <Pagination onChange={handleChange} count={counting} />
      </div>
    </>
  );
};

export default Role;
