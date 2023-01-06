import { ENDPOINTURL } from "../helper";
import { get, post, put, remove } from "../web.request";


// API for Login (email,password)
export const loginHandler = (body) => {
    return post(`${ENDPOINTURL}/login`, body);
}

// For Dashboard data (graph, Work hours)
export const dashboardHandler = (body) => {
    return post(`${ENDPOINTURL}/api/dashboard/list`, body);
}

// For CheckIn and CheckOut Event in dashboard
export const dashboardAttendanceHandler = (body) => {
    return post(`${ENDPOINTURL}/api/attendance`, body);
}

// For Role Table in role page 
export const RoleHandler = (body) => {
    return post(`${ENDPOINTURL}/api/role/list`, body);
}

// For Role Table to delete one role data
export const RoleDeleteHandler = (ids, data) => {
    return remove(`${ENDPOINTURL}/api/role/${ids}`, data);
}

// For Role Table to delete one role data
export const RoleDeleteAllHandler = (ids, data) => {
    return remove(`${ENDPOINTURL}/api/role/${ids}`, data);
}

// For Adding Role to Table 
export const AddRoleHandler = (body) => {
    return post(`${ENDPOINTURL}/api/role`, body);
}

// For Updating Role to Table 
export const UpdateRoleHandler = (id, body) => {
    return put(`${ENDPOINTURL}/api/role/${id}`, body);
}

// For Updating Role to Table 
export const GetRoleHandler = (id) => {
    return get(`${ENDPOINTURL}/api/role/${id}`);
}

// For User Table in User page 
export const UserHandler = (body) => {
    return post(`${ENDPOINTURL}/api/user/list`, body);
}
// For User Table to delete one User data
export const UserDeleteHandler = (ids, data) => {
    return remove(`${ENDPOINTURL}/api/user/${ids}`, data);
}
// For User Table to delete one User data
export const UserDeleteAllHandler = (ids, data) => {
    return remove(`${ENDPOINTURL}/api/user/${ids}`, data);
}
// For Adding User to Table 
export const AddUserHandler = (body) => {
    return post(`${ENDPOINTURL}/api/user`, body);
}
// For Updating User to Table 
export const UpdateUserHandler = (id, body) => {
    return put(`${ENDPOINTURL}/api/user/${id}`, body);
}
// For Updating User to Table 
export const GetUserHandler = (id) => {
    return get(`${ENDPOINTURL}/api/user/${id}`);
}


// For Adding Task to Table 
export const AddTaskHandler = (body) => {
    return post(`${ENDPOINTURL}/api/task`, body);
}
// For Updating Task to Table 
export const UpdateTaskHandler = (id, body) => {
    return put(`${ENDPOINTURL}/api/task/${id}`, body);
}
// For Updating Task to Table 
export const GetTaskHandler = (id) => {
    return get(`${ENDPOINTURL}/api/task/${id}`);
}
// For Task Table in Task page 
export const TaskHandler = (body) => {
    return post(`${ENDPOINTURL}/api/task/list`, body);
}
// For Task Table to delete one Task data
export const TaskDeleteHandler = (ids, data) => {
    return remove(`${ENDPOINTURL}/api/task/${ids}`, data);
}
// For Task Table to delete one Task data
export const TaskDeleteAllHandler = (ids, data) => {
    return remove(`${ENDPOINTURL}/api/task/${ids}`, data);
}



// For Project Table in Project page 
export const ProjectHandler = (body) => {
    return post(`${ENDPOINTURL}/api/project/list`, body);
}
// For Project Table to delete one Project data
export const ProjectDeleteHandler = (ids, data) => {
    return remove(`${ENDPOINTURL}/api/project/${ids}`, data);
}
// For Project Table to delete one Project data
export const ProjectDeleteAllHandler = (ids, data) => {
    return remove(`${ENDPOINTURL}/api/project/${ids}`, data);
}
// For Adding Project to Table 
export const AddProjectHandler = (body) => {
    return post(`${ENDPOINTURL}/api/project`, body);
}
// For Updating Project to Table 
export const UpdateProjectHandler = (id, body) => {
    return put(`${ENDPOINTURL}/api/project/${id}`, body);
}
// For Updating Project to Table 
export const GetProjectHandler = (id) => {
    return get(`${ENDPOINTURL}/api/project/${id}`);
}

// For update image in profile section
export const ProfileImageHandler = (bodydata) => {
    return put(`${ENDPOINTURL}/api/user/profile`, bodydata);
}

// For Leave in Leave section
export const AddLeaveHandle = (bodydata) => {
    return post(`${ENDPOINTURL}/api/leave`, bodydata);
}

