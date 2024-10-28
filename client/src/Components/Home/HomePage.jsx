import "./home.css";
import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { deleteUser, getAllUsers } from "../../redux/apiRequest";
import { useNavigate } from "react-router-dom";
import { loginSuccess } from "../../redux/authSlice";
import { createAxios } from "../../createInstance";

const HomePage = () => {
  const user = useSelector((state) => state.auth.login?.currentUser);
  const userList = useSelector((state) => state.users.users.allUsers?.data);
  const msg = useSelector((state) => state.users.msg?.message);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  let axiosJWT = createAxios(user, dispatch, loginSuccess);

  const handleDelete = (id) => {
    deleteUser(user?.accessToken, dispatch, id, axiosJWT);
  };

  useEffect(() => {
    if (!user) {
      navigate("/login");
    }
    if (user?.accessToken) {
      getAllUsers(user?.accessToken, dispatch, axiosJWT);
    }
  }, []);

  return (
    <main className="home-container">
      <div className="home-title">User List</div>
      <div className="home-role">{`Your role: ${
        user?.others?.admin ? "admin" : "user"
      }`}</div>
      <div className="home-userlist">
        {userList?.map((user) => {
          return (
            <div className="user-container" key={user.username}>
              <div className="home-user">{user.username}</div>
              <div
                className="delete-user"
                onClick={() => handleDelete(user._id)}
              >
                {" "}
                Delete{" "}
              </div>
            </div>
          );
        })}
        <div className="err_msg">{msg}</div>
      </div>
    </main>
  );
};

export default HomePage;
