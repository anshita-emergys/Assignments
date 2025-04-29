import { useForm } from "react-hook-form";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { instance } from "../../../api/axios";
import {
  addDiseaseInfo,
  updateDiseaseInfo,
} from "../../../redux/thunks/patient";
import Button from "../../../components/formButton/FormButton";
import PropTypes from "prop-types";

const DiseaseInfo = ({
  onNext,
  onBack,
  formData,
  id,
  setFormData,
  setShowEditForm,
}) => {
  const patientId = useSelector((state) => state.patient.patientId);
  const dispatch = useDispatch();

  const {
    register,
    handleSubmit,
    formState: { errors },
    trigger,
    reset,
  } = useForm({
    defaultValues: formData,
  });

  useEffect(() => {
    const fetchDiseaseInfo = async () => {
      if (id || patientId) {
        const fetchId = id || patientId;
        try {
          const response = await instance.get(
            `/patient/getDiseaseInfo/${fetchId}`
          );
          if (response.error) {
            console.error(response.error);
            return;
          }
          reset(response.data.data[0]);
          setFormData({ ...formData, diseaseInfo: response.data.data[0] });
        } catch (error) {
          console.error(error);
        }
      }
    };
    fetchDiseaseInfo();
  }, [id]);

  const onSubmit = async (data) => {
    let updatePayload = { ...data, patient_id: patientId };
    const addPayload = { diseaseDetails: { ...data, patient_id: patientId } };

    try {
      let result;

      if (id) {
        result = await dispatch(updateDiseaseInfo(updatePayload));
        setShowEditForm(false);
      } else if (formData && Object.keys(formData).length !== 0) {
        result = await dispatch(updateDiseaseInfo(updatePayload));
      } else {
        result = await dispatch(addDiseaseInfo(addPayload));
      }

      if (result?.error) {
        console.error(result.error);
        return;
      }
      onNext({ diseaseInfo: data });
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="patient_form disease-container"
    >
      <h2>Disease Information</h2>
      <div className="input_label">
        <label>Disease Type</label>
        <input
          type="text"
          maxLength={20}
          {...register("disease_type", {
            required: "Disease type is required",
            minLength: {
              value: 3,
              message: "Disease type must be at least 3 characters",
            },
            pattern: {
              value: /^[A-Za-z]+( [A-Za-z]+)*$/,
              message: "Invalid disease type format",
            },
          })}
          onChange={(e) => {
            const { onChange } = register("disease_type");
            onChange(e);
            trigger("disease_type");
          }}
        />
        <p className="auth-error">
          {errors.disease_type && errors.disease_type.message}
        </p>
      </div>
      <div className="input_label">
        <label>Disease Description</label>
        <textarea
          type="text"
          maxLength={80}
          {...register("disease_description", {
            required: "Disease description is required",
            minLength: {
              value: 3,
              message: "Disease description must be at least 3 characters",
            },
            pattern: {
              value: /^[A-Za-z0-9.,'()\- ]+$/,
              message: "Invalid disease name format",
            },
          })}
          onChange={(e) => {
            const { onChange } = register("disease_description");
            onChange(e);
            trigger("disease_description");
          }}
        />
        <p className="auth-error">
          {errors.disease_description && errors.disease_description.message}
        </p>
      </div>

      <Button onBack={onBack} hide={true} setShowEditForm={setShowEditForm} />
    </form>
  );
};

DiseaseInfo.propTypes = {
  onNext: PropTypes.func,
  onBack: PropTypes.func,
  formData: PropTypes.object,
  id: PropTypes.string,
  setFormData: PropTypes.func,
  setShowEditForm: PropTypes.func,
};

export default DiseaseInfo;
