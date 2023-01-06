import React, { useEffect, useState } from "react";
import "./profile.css";
import { SkeletonProfile1 } from "../../components/skeleton";
import { GetUserHandler, ProfileImageHandler } from "../../service/auth.service";

const Profile = (props) => {
  document.title = "Profile | FMS";
  const [userdata, setUserdata] = useState("");
  const [editimage, setEditimage] = useState(null);
  var id = localStorage.getItem("id");

  const getUserData = async () => {
    const response = await GetUserHandler(id, "tokenPass");

    setUserdata(response.data.data);
    setEditimage(response.data.data.image);

  };
  useEffect(() => {
    getUserData();
  }, []);  // eslint-disable-line react-hooks/exhaustive-deps

  const handleupdate = async (e) => {
    // if (e < 1e6) {
    let bodydata = new FormData();
    bodydata.append("id", id);
    bodydata.append("Image", e);
    await ProfileImageHandler(bodydata);
    setEditimage(URL.createObjectURL(e));
  };

  return (
    <>
      <div className="main_dashboard">

        <div className="profile">
          <div className="left_side">
            <div className="col-sm-3">
              {editimage && (
                <div className="card m-3">
                  <img src={editimage} className="card-img-top" alt="..." />
                </div>
              )}
              {!editimage && (
                <div className="card m-3">
                  <img src="/images/profile.jpg" className="card-img-top" alt="profile" />
                </div>
              )}
              <div className="image-upload">
                <label htmlFor="file-input">
                  <i className="fa fa-camera " aria-hidden="true"></i>
                </label>
                <input
                  id="file-input"
                  type="file"
                  onChange={(e) => handleupdate(e.target.files[0])}
                  accept="image/x-png,image/jpeg"
                />
              </div>
            </div>
          </div>

          <div className="right_side">
            <div className="information_table">

              {userdata && (
                <>
                  <div className="first_row">
                    <div className="profile_row">
                      <label htmlFor="staticEmail" className="col-form-label">
                        First Name :
                      </label>
                    </div>

                    <div className="text">
                      <input
                        type="text"
                        readOnly
                        className="form-control border border-dark"
                        id="staticEmail"
                        value={userdata.first_name}
                      />
                    </div>

                  </div>

                  <div className="secound_row">
                    <div className="profile_row">
                      <label htmlFor="staticEmail" className="col-form-label">
                        Last Name:
                      </label>
                    </div>

                    <div className="text">
                      <input
                        type="text"
                        readOnly
                        className="form-control border border-dark"
                        id="staticEmail"
                        value={userdata.last_name}
                      />
                    </div>

                  </div>

                  <div className="Third_row">
                    <div className="profile_row">
                      <label htmlFor="staticEmail" className="col-form-label">
                        Email :
                      </label>
                    </div>

                    <div className="text">
                      <input
                        type="text"
                        readOnly
                        className="form-control border border-dark"
                        id="staticEmail"
                        value={userdata.email}
                      />
                    </div>

                  </div>

                  <div className="Four_row">
                    <div className="profile_row">
                      <label htmlFor="staticEmail" className="col-form-label">
                        Mobile No :
                      </label>
                    </div>

                    <div className="text">
                      <input
                        type="text"
                        readOnly
                        className="form-control border border-dark"
                        id="staticEmail"
                        value={userdata.mobile}
                      />
                    </div>

                  </div>

                  <div className="Five_row">
                    <div className="profile_row">
                      <label htmlFor="staticEmail" className="col-form-label">
                        Role :
                      </label>
                    </div>

                    <div className="text">
                      <input
                        type="text"
                        readOnly
                        className="form-control border border-dark"
                        id="staticEmail"
                        value={userdata.role?.name}
                      />
                    </div>

                  </div>

                </>
              )}
              {!userdata && (
                <>

                  <div className="first_row">
                    <div className="profile_row">
                      <label htmlFor="staticEmail" className="col-form-label">
                        First Name :
                      </label>
                    </div>

                    <div className="text">
                      {SkeletonProfile1(460, 66)}
                    </div>

                  </div>

                  <div className="secound_row">
                    <div className="profile_row">
                      <label htmlFor="staticEmail" className="col-form-label">
                        Last Name:
                      </label>
                    </div>

                    <div className="text">
                      {SkeletonProfile1(460, 66)}
                    </div>

                  </div>

                  <div className="Third_row">
                    <div className="profile_row">
                      <label htmlFor="staticEmail" className="col-form-label">
                        Email :
                      </label>
                    </div>

                    <div className="text">
                      {SkeletonProfile1(460, 66)}
                    </div>

                  </div>

                  <div className="Four_row">
                    <div className="profile_row">
                      <label htmlFor="staticEmail" className="col-form-label">
                        Mobile No :
                      </label>
                    </div>

                    <div className="text">
                      {SkeletonProfile1(460, 66)}
                    </div>

                  </div>

                  <div className="Five_row">
                    <div className="profile_row">
                      <label htmlFor="staticEmail" className="col-form-label">
                        Role :
                      </label>
                    </div>

                    <div className="text">
                      {SkeletonProfile1(460, 66)}
                    </div>

                  </div>

                </>
              )}
            </div>

          </div>
        </div>

      </div>




    </>
  );
};

export default Profile;
