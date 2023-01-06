import React, { useEffect, useState } from "react";
import Graph from "../../components/graph";
import "./dashboard.css";
import Clock from "react-live-clock";
import { SkeletonButton, SkeletonWorkHours } from "../../components/skeleton";
import { dashboardHandler } from "../../service/auth.service";
import { dashboardAttendanceHandler } from "../../service/auth.service";

const Dashboard = () => {
  document.title = "Dashboard | FMS";
  const [countData, SetCountData] = useState("");
  const [graphData, SetGraphData] = useState(null);
  const [taskList, SetTaskList] = useState([]);
  const [status, setStatus] = useState(null);
  const [workhours, setWorkhours] = useState([]);
  const [loading, setLoading] = useState(false);
  const [dataNotFound, setDataNotFound] = useState(false);

  const body = {
    userid: localStorage.getItem("id"),
  };
  const getDashboardData = async () => {
    const response = await dashboardHandler(body);
    SetCountData(response.data.data.count);
    SetGraphData(response.data.data.taskGraphData);
    SetTaskList(response.data.data.taskListDetails);
    setWorkhours(response.data.data.workhours);
    setStatus(response.data.data.attendancestatus)
  };
  useEffect(() => {
    getDashboardData();

      // const getStatus = localStorage.getItem("status");
      // setStatus(getStatus);
    
  }, []);// eslint-disable-line react-hooks/exhaustive-deps


  const getAttendanceData = async () => {
    setLoading(true);
    setDataNotFound(false);
    const body = JSON.stringify({
      userid: localStorage.getItem("id"),
      date: new Date(),
    });

    const response = await dashboardAttendanceHandler(body);
    if (response) {
      setLoading(false);
      if (response.status === 200) {
        getDashboardData();
        localStorage.setItem("status", response.data.data.status);
        setStatus(response.data.data.status);
      }
    } else {
      setDataNotFound(true);
    }
  };

  const current = new Date();
  const date = `${current.getDate()}-${current.getMonth() + 1
    }-${current.getFullYear()}`;

  return (
    <>
      <div className="main_dashboard_box">
        <div className="main_dashboard">
          <div className="center">
            <div className="cards">
              <div className="dashboard_card">
                <div className="card-header role">ROLE</div>
                <div className="card-body d-flex">
                  <h5 className="card-title "> Total Role :</h5>
                  <p className="card-text">{countData.totalRole}</p>
                </div>
              </div>
              <div className="dashboard_card">
                <div className="card-header user">USER</div>
                <div className="card-body  d-flex">
                  <h5 className="card-title">Total User :</h5>
                  <p className="card-text">{countData.totalUsers}</p>
                </div>
              </div>
              <div className="dashboard_card">
                <div className="card-header task">TASK</div>
                <div className="card-body  d-flex">
                  <h5 className="card-title">Total Task :</h5>
                  <p className="card-text">{countData.totalTask}</p>
                </div>
              </div>
              <div className="dashboard_card">
                <div className="card-header project">PROJECT</div>
                <div className="card-body d-flex ">
                  <h5 className="card-title">Total Project :</h5>
                  <p className="card-text">{countData.totalProject}</p>
                </div>
              </div>
            </div>

            {graphData &&
              <Graph data={graphData} />}
            {!graphData &&
              <img src="/images/line_graph_skeleton.png" alt="graph" width="900px" height="470x" />
            }
          </div>
          {/* right section begin*/}
          <div className="rightside">
            <div className="Attendance_card bg-light rounded-3">
              <div className="card-header d-flex justify-content-center">
                <div>
                  <img src="/images/check.png" alt="profile" width="20px" height="20px" />
                </div>
                <div>
                  <h5> Attendance</h5>
                </div>
              </div>

              <div className="card_body">
                {loading ? (
                  <div className="btn">{SkeletonButton(80, 25)}</div>
                ) : (
                  <>
                    {status && (
                      <>
                        <button
                          type="button"
                          onClick={getAttendanceData}
                          className={
                            status === "CHECKIN"
                              ? "btn btn-danger"
                              : "btn btn-success"
                          }
                        >
                          {status === "CHECKIN" ? (
                            <b>Check-out</b>
                          ) : (
                            <b>Check-In</b>
                          )}
                        </button>
                        <br />
                      </>
                    )}
                
                  </>
                )}
                <p className="card-text mx-3"></p>

                <h5 className="card-date">{date}</h5>

                <h5 className="clock">
                  <i className="fa fa-clock-o" aria-hidden="true"></i>
                  <Clock format="HH:mm:ss" interval={1000} ticking={true} />
                </h5>
              </div>
            </div>

            <div className="information">
              <ul className="list_group_main rounded-3">
                <li className="list-group-item d-flex justify-content-between align-items-center bg-primary text-white">
                  TASK STATUS
                </li>
                {taskList &&
                  taskList.length > 0 &&
                  taskList.map((data, ind) => {
                    return (
                      <li
                        key={`list-group ${ind}`}
                        className="list-group-item d-flex justify-content-between align-items-center"
                      >
                        {data.Name}
                        <span className="badge rounded-pill">
                          {data.Status}
                        </span>
                      </li>
                    );
                  })}
              </ul>
            </div>

            <div className="timing_table">
              <table className="table dashboard table-bordered table-primary">
                <thead>
                  <tr>
                    <th scope="col">Date</th>
                    <th scope="col">Total Hours</th>
                    <th scope="col">Status</th>
                  </tr>
                </thead>
                {workhours &&
                  workhours.length > 0 &&
                  !loading &&
                  workhours.map((data, index) => {
                    return (
                      <tbody key={index}>
                        <tr >
                          <td>{data.date}</td>
                          <td>{data.totalhours}</td>
                          <td>
                            {data.totalhours.length > 0 ? "Present" : "Holiday"}
                          </td>
                        </tr>
                      </tbody>
                    );
                  })}
                {dataNotFound && (
                  <tbody className="table-role-body rounded-3">
                    <tr>
                      <td colSpan="3">Data not Founnd</td>
                    </tr>
                  </tbody>
                )}
                {loading &&
                  [1, 2, 3, 4, 5].map((index) => {
                    return (
                      <tbody>
                        <tr key={index}>
                          <td>{SkeletonWorkHours(80, 30)}</td>
                          <td>{SkeletonWorkHours(80, 30)}</td>
                          <td>{SkeletonWorkHours(80, 30)}</td>
                        </tr>
                      </tbody>
                    );
                  })}
              </table>
            </div>
          </div>
          {/* right section end*/}
        </div>
      </div>
    </>
  );
};

export default Dashboard;
