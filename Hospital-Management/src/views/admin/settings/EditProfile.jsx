import { useEffect, useState } from "react";
import Signup from "@views/authentication/Signup";
import { useDispatch } from "react-redux";
import { getUser } from "@redux/thunks/user";

const EditProfile = () => {
  const dispatch = useDispatch();
  const [userData, setUserData] = useState({});

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await dispatch(getUser());
        if (response.error) {
          console.error(response.error);
          return;
        }
        setUserData(response.payload.data[0]);
      } catch (error) {
        console.error(error);
      }
    };
    fetchUserData();
  }, []);

  return (
    <div className="content-edit">
      <Signup isEditMode={true} userData={userData} />
    </div>
  );
};

export default EditProfile;
