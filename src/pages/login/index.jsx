import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import "./login.css";
import { loginHandler } from "../../service/auth.service";
import { successToast, errorToast } from "../../helper.js"
import ReactLoading from 'react-loading';

function Login(props) {
  document.title = "Login | FMS";
  const history = useHistory();
  if (!localStorage.getItem("token")) {
    history.push(`/`)
  }

  const initialValues = { email: "", password: "" };
  const [formValues, setformValues] = useState(initialValues);
  const [formErrors, setformErrors] = useState({ email: "", password: "" });
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);

  const togglePassword = () => {
    setShow(!show);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setformValues({ ...formValues, [name]: value });
  };

  const handleSubmit = async (e) => {
    setLoading(true)
    e.preventDefault();
    setformErrors(validate(formValues));

    const body = JSON.stringify({
      email: formValues.email,
      password: formValues.password,
    });

    const response = await loginHandler(body);
    setLoading(false)
    if (response.data.success === true) {
      successToast(response.data.message);
      console.log("response ", response.data)
      localStorage.setItem('Name', response.data.data.first_name);
      localStorage.setItem('lastname', response.data.data.last_name);
      localStorage.setItem('id', response.data.data.id);
      localStorage.setItem('rights', JSON.stringify(response.data.data.rights));
      localStorage.setItem('token', response.data.data.token);
      localStorage.setItem('image', response.data.data.image);
      history.push("/dashboard");

    } else {
      errorToast(response.data.message)
    }
  };
  const validate = (values) => {
    const errors = {};
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i;

    if (!values.email) {
      errors.email = "*email is required";
    } else if (!regex.test(values.email)) {
      errors.email = "*This is not a valid email";
    }

    if (!values.password) {
      errors.password = "*password is required";
    }

    return errors;
  };

  return (
    <div className="app">
      {loading ? <ReactLoading type="spinningBubbles" color="#fff" className="Loading" height={'7%'} width={'7%'} /> : ""}
      <div className="right">
        <div className="right_image">
          <img src="/images/80563-login.gif" alt="login_back_img" />
        </div>
      </div>
      <div className="left">

        <div className="login-form">
          <div className="form_header"><img src="/images/logo.svg" alt="Logo" /></div>
          <div>
            <form onSubmit={handleSubmit}>
              <div className="input-container">
                <div className="icon_box">
                  <div className="fa_icon">
                    <i
                      style={{ color: "white" }}
                      className="fa fa-envelope"
                      aria-hidden="true"
                    ></i>
                  </div>

                  <div className="email_text">
                    <input
                      type="email"
                      name="email"
                      placeholder="Enter your Email"
                      value={formValues.email}
                      onChange={(e) => [
                        setformErrors({ ...formErrors, email: "" }),
                        handleChange(e),
                      ]}
                    />
                  </div>
                </div>
              </div>
              <div className="errors">
                <p>{formErrors.email}</p>
              </div>

              <div className="input-container">
                <div className="icon_box">
                  <div className="fa_icon">
                    <i
                      style={{ color: "white" }}
                      className="fa fa-lock"
                      aria-hidden="true"
                    ></i>
                  </div>
                  <div className="text_pw">
                    <input
                      type={show ? "text" : "password"}
                      name="password"
                      placeholder="Enter your password"
                      value={formValues.password}
                      onChange={(e) => [
                        setformErrors({ ...formErrors, password: "" }),
                        handleChange(e),
                      ]}
                    />
                    <i
                      className={!show ? "fa fa-eye-slash" : "fa fa-eye"}
                      aria-hidden="true"
                      onClick={togglePassword}
                    ></i>

                  </div>
                </div>
              </div>
              <div className="errors">
                <p>{formErrors.password}</p>
              </div>
              <div className="button-container">
                <input type="submit" value="Login" disabled={loading ? true : false} />
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>

  );
}

export default Login;
