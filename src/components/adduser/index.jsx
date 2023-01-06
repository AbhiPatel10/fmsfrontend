import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import { AddUserHandler, UpdateUserHandler, GetUserHandler, RoleHandler } from "../../service/auth.service";
import { Name_REGEX, EMAIL_REGEX, Mobile_REGEX } from "../../helper/validation";
import { successToast, errorToast } from "../../helper.js"
import { useHistory } from "react-router-dom";

const Adduser = (props) => {
    const { id } = useParams();
    document.title = id ? "UpdateUser | FMS" : "AddUser | FMS";
    const history = useHistory();
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [mobile, setMobile] = useState("");
    const [role, setRole] = useState("");
    const [roleData, setRoleData] = useState("");

    // for validation error
    const [errorfirstName, seterrorFirstName] = useState("");
    const [errorlastName, setErrorLastName] = useState("");
    const [erroremail, setErrorEmail] = useState("");
    const [errormobile, seterrorMobile] = useState("");
    const [errorroleData, seterrorRoleData] = useState("");


    function uservalidator() {
        let formIsValid = true;
        if (!Name_REGEX.test(firstName) === true) {
            formIsValid = false;
            seterrorFirstName("Enter Valid First Name");
        } if (!Name_REGEX.test(lastName) === true) {
            formIsValid = false;
            setErrorLastName("Enter Valid Last Name");
        } if (!EMAIL_REGEX.test(email) === true) {
            formIsValid = false;
            setErrorEmail("Enter Valid Email");
        } if (!Mobile_REGEX.test(mobile) === true) {
            formIsValid = false;
            seterrorMobile("Enter Valid Mobile Number");
        } if (roleData.length === 0) {
            formIsValid = false;
            seterrorRoleData("Please Select One Role For User")
        }
        return formIsValid;
    }

    const handleSubmit = async () => {
        if (uservalidator()) {
            const AddbodyData = {
                "first_name": firstName,
                "last_name": lastName,
                "email": email,
                "mobile": mobile,
                "role": roleData,
            }
            if (!id) {
                const response = await AddUserHandler(AddbodyData);
                if (response.data.success) {
                    successToast(response.data.message);
                    setFirstName("");
                    setLastName("");
                    setEmail("");
                    setMobile("");
                    setRoleData("");
                    history.push("/user");
                } else {
                    errorToast(response.data.message)
                }
            }
            else {
                const response = await UpdateUserHandler(id, AddbodyData);
                if (response.data.success) {
                    successToast(response.data.message);
                    history.push("/user");
                } else {
                    errorToast(response.data.message)
                }
            }
        }
    };
    const getUserData = async () => {

        if (id) {
            const response = await GetUserHandler(id, "tokenPass");
            setFirstName(response.data.data.first_name);
            setLastName(response.data.data.last_name);
            setEmail(response.data.data.email);
            setMobile(response.data.data.mobile);
            setRoleData(response.data.data.role._id);
        }
    }

    useEffect(() => {
        getUserData();
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    const getalldata = async () => {
        const body = JSON.stringify({
            where: {
                isActive: "true",
            },
            pagination: {
                sortBy: "createdAt",
                descending: true,
                rowsPerPage: 44,
                page: 1,
            },
        });
        const response = await RoleHandler(body);
        setRole(response.data.data.list);
    }; useEffect(() => {
        getalldata();
    }, []);

    const roleHandler = (roleid) => {
        setRoleData(roleid)
    }

    return (
        <div className="project_conrainer">
            <h3 style={{ color: "rgb(33 37 41)", marginLeft: "100px", marginBottom: "20px", fontSize: "35px", fontWeight: "bolder" }}> {id ? "Update-User" : "Add-User"}</h3>

            <div className="mb-3 row">
                <label htmlFor="staticEmail" className="col-sm-2 col-form-label">
                    <b>First Name</b>
                </label>
                <div className="col-sm-10">
                    <input
                        type="text"
                        id="staticEmail"
                        className="form-control w-auto border border-dark"
                        firstname="firstName"
                        value={firstName}
                        onChange={(e) => [setFirstName(e.target.value), seterrorFirstName('')]}
                        maxLength="15"
                        placeholder="Enter your first name"
                    />
                    <p className="Errorstyle">{errorfirstName}</p>
                </div>
            </div>
            <div className="mb-3 row">
                <label htmlFor="staticEmail" className="col-sm-2 col-form-label">
                    <b> Last Name</b>
                </label>
                <div className="col-sm-10">
                    <input
                        type="text"
                        id="staticEmail"
                        className="form-control w-auto border border-dark"
                        lastname="lastname"
                        value={lastName}
                        maxLength="15"
                        onChange={(e) => [setLastName(e.target.value), setErrorLastName('')]}
                        placeholder="Enter your last name"
                    />
                    <p className="Errorstyle">{errorlastName}</p>
                </div>
            </div>
            <div className="mb-3 row">
                <label htmlFor="staticEmail" className="col-sm-2 col-form-label">
                    <b> Email</b>
                </label>
                <div className="col-sm-10">
                    <input
                        type="text"
                        className="form-control w-auto border border-dark"
                        id="staticEmail"
                        name="email"
                        value={email}
                        onChange={(e) => [setEmail(e.target.value), setErrorEmail('')]}
                        placeholder="Enter your Email"
                    />
                    <p className="Errorstyle">{erroremail}</p>
                </div>
            </div>

            <div className="mb-3 row">
                <label htmlFor="staticEmail" className="col-sm-2 col-form-label">
                    <b>Phone number</b>
                </label>
                <div className="col-sm-10">
                    <input
                        type="text"
                        className="form-control w-auto border border-dark"
                        id="staticEmail"
                        name="mobile"
                        value={mobile}
                        onChange={(e) => [setMobile(e.target.value), seterrorMobile('')]}
                        placeholder="Enter your number"
                    />
                    <p className="Errorstyle">{errormobile}</p>
                </div>
            </div>
            <div className="mb-3 row">
                <label htmlFor="inputPassword" className="col-sm-2 col-form-label">
                    <b> Role</b>
                </label>
                <div className="col-sm-10">
                    <select value={id ? roleData : role.name} onChange={(e) => [roleHandler(e.target.value), seterrorRoleData('')]} className="form-select w-auto border border-dark" aria-label="Default select example">
                        <option> Select Role </option>
                        {role.length > 0 && role.map((roles, index) => {
                            return (
                                <option key={`col-form-label ${index}`} value={roles._id}> {roles.name}</option>
                            )
                        })}
                    </select>
                    <p className="Errorstyle">{errorroleData}</p>
                </div>
            </div>

            <button type="button" className="btn btn-success m-4" onClick={handleSubmit}> {id ? 'Update' : 'Create'}</button>
            <Link to="/user">
                <button type="button" className="btn btn-danger">Back</button>
            </Link>
        </div>
    );
}


export default Adduser;