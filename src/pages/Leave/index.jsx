import React, { useState } from "react";
import moment from 'moment'
import "./leave.css"
import { AddLeaveHandle } from "../../service/auth.service";
import { successToast } from "../../helper.js";
import { Link } from "react-router-dom";

function Leave() {
    const [leaveType, setLeaveType] = useState("");
    const [errorleaveType, setErrorLeaveType] = useState("");
    const [StartDate, setStartdate] = useState(moment(new Date()).format("YYYY-MM-DD"));
    const [EndDate, setEnddate] = useState(moment(new Date()).format("YYYY-MM-DD"));
    const [dateError, setDateerror] = useState('')
    const [reason, setReason] = useState("");

    const defaultdate = moment(new Date()).format("YYYY-MM-DD")

    function Leavevalidator() {
        let formIsValid = true;
        if (leaveType.length === 0) {
            formIsValid = false;
            setErrorLeaveType("Please Select one Leave type");
        } if (StartDate.length === 0 || EndDate.length === 0) {
            formIsValid = false;
            setDateerror("Please Select Date")
        }
        return formIsValid;
    }

    const handleSubmit = async () => {
        if (Leavevalidator()) {
            const data = {
                user_id: localStorage.getItem('id'),
                leaveType: leaveType,
                start_date: StartDate,
                end_date: EndDate,
                reason: reason
            }
            const response = await AddLeaveHandle(data);

            successToast(response.data.message);
            console.info("leave response ", response.data)
            if(response.data.success){
                console.log("yes data clearededddd")
                setLeaveType("");
                setStartdate(moment(new Date()).format("YYYY-MM-DD"));
                setEnddate(moment(new Date()).format("YYYY-MM-DD"));
                setReason("");
            }
        }
    }

    return (
        <div className="dashright_content main_leave_container">
            <div className="m-5">
                <div className="Leave_header"><h3>Leave</h3></div>
                <div className="m-3 row">
                    <label htmlFor="staticEmail" className="col-sm-2"><b>Name: </b></label>
                    <div className="col-sm-10">
                        <input type="text" className="form-control w-50 border-dark" value={localStorage.getItem('Name')} disabled />
                    </div>
                </div>
                <div className="m-3 row">
                    <label htmlFor="staticEmail" className="col-sm-2"><b>Leave Type : </b></label>
                    <div className="col-sm-10">
                        <select className="form-select w-50" aria-label="Default select example" value={leaveType} onChange={(e) => [setLeaveType(e.target.value), setErrorLeaveType('')]}>
                            <option>Open this select menu</option>
                            <option value="LEAVE">Leave</option>
                            <option value="COMPENSATORY_OFF">Compensatory off</option>
                        </select>
                        <p className="Errorstyle">{errorleaveType}</p>
                    </div>
                </div>
                <div className="m-3 row">
                    <label className="col-sm-2"><b>Date : </b></label>
                    <div className="col-sm-10 w-50" >
                        <span>Start Date</span>
                        <input type="date" className="form-control mb-2"  dateFormat="YYYY/MM/DD" placeholder="dd-mm-yyyy" value={StartDate} defaultValue={defaultdate} name="startdate" onChange={(e) => [setStartdate(e.target.value), setDateerror('')]} min={moment(new Date()).add(1, "days").format("YYYY-MM-DD")} />
                        <span>End Date</span>
                        <input type="date" className="form-control "  dateFormat="YYYY/MM/DD" placeholder="dd-mm-yyyy" value={EndDate} defaultValue={defaultdate} name="enddate" onChange={(e) => [setEnddate(e.target.value), setDateerror('')]} min={moment(new Date()).add(1, "days").format("YYYY-MM-DD")} />
                        <p className="Errorstyle">{dateError}</p>
                    </div>
                </div>
                <div className="m-3 row">
                    <label className="col-sm-2 ">
                        <b>Reason</b>
                    </label>
                    <div className="col-sm-10">
                        <textarea
                            onChange={(e) => setReason(e.target.value)}
                            value={reason}
                            rows="3"
                            className=" w-50 border border-dark"
                        ></textarea>
                    </div>
                </div>
                <button type="button" className="btn btn-primary m-4" onClick={handleSubmit}>Submit</button>
                <Link to="/dashboard">
                    <button type="button" className="btn btn-danger m-4" onClick={handleSubmit}>Back</button>
                </Link>
            </div>
        </div>
    );
}

export default Leave;
