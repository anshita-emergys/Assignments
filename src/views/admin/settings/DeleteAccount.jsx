import { useNavigate } from "react-router";
import { toast } from "react-toastify";
import { useDispatch } from "react-redux";
import { deleteUser } from "@redux/thunks/user";
import { updateToken } from "@redux/slices/authSlice";

const DeleteAccount = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

    const handleDeleteAccount = async () => {
      try {
        await dispatch(deleteUser());
        dispatch(updateToken(null,null));
        navigate("/signup");
      } catch (error) {
        console.error(error);
        toast.error(error.response.data.message)
      }
    };

    return (
      <div className="delete-account">
        <h2>Delete Account</h2>
        <p>
          Are you sure you want to delete your account? This action is permanent
          and cannot be undone.
        </p>
        <button type="button" onClick={handleDeleteAccount}>Delete Account</button>
      </div>
    );
  };

  export default DeleteAccount;