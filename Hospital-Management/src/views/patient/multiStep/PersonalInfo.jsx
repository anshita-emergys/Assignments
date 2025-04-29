import React, { useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useForm, Controller } from "react-hook-form";
import {
  getPersonalInfo,
  updatePersonalInfo,
  addPersonalInfo,
} from "../../../redux/thunks/patient";
import Button from "../../../components/formButton/FormButton";
import countryList from "react-select-country-list";
import Select from "react-select";
import moment from "moment";
import InputField from "../../../components/inputField/InputField";
import { setPatientId } from "../../../redux/slices/patientsSlice";
import { selectStyle } from "../../../utils/selectStyle";
import PropTypes from "prop-types";

const PersonalInfo = ({
  onNext,
  formData,
  setFormData,
  id,
  setShowEditForm,
}) => {
  const maxDate = moment().format("YYYY-MM-DD");
  const patientId = useSelector((state) => state.patient.patientId);
  const dispatch = useDispatch();

  const {
    register,
    handleSubmit,
    formState: { errors },
    trigger,
    reset,
    control,
  } = useForm({
    defaultValues: formData,
  });

  const options = useMemo(() => {
    const labels = countryList().getLabels();
    return labels.map((label) => ({
      label: label,
      value: label,
    }));
  }, []);

  useEffect(() => {
    const fetchPersonalInfo = async () => {
      if (id || patientId) {
        const fetchId = id || patientId;
        const result = await dispatch(getPersonalInfo(fetchId));
        if (result.error) {
          console.error(result.error);
          return;
        }
        const formattedDate = moment(result.payload.data[0].date).format(
          "YYYY-MM-DD"
        );
        reset({ ...result.payload.data[0], date_of_birth: formattedDate });
        setFormData({ ...formData, personalInfo: result.payload.data[0] });
      }
    };
    fetchPersonalInfo();
  }, [id, patientId, dispatch]);

  const onSubmit = async (data) => {
    try {
      let result;
      let updatePayload = { ...data, patient_id: patientId };
      if (id) {
        updatePayload = { ...data, patient_id: id };
        result = await dispatch(updatePersonalInfo(updatePayload));
        setShowEditForm(false);
      } else if (formData && Object.keys(formData).length !== 0) {
        result = await dispatch(updatePersonalInfo(updatePayload));
      } else {
        result = await dispatch(addPersonalInfo(data));
        if (result.error) {
          console.error(result.error);
          return;
        }
        dispatch(setPatientId(result.payload.data.patient_id));
        localStorage.setItem("patientId", result.payload.data.patient_id);
      }
      if (result.error) {
        console.error(result.error);
        return;
      }

      onNext({ personalInfo: data });
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="patient_form">
      <h2>Personal Information</h2>

      <div className="input-grid">
        <InputField
          label="Patient Name"
          id="patient_name"
          type="text"
          register={register}
          errors={errors}
          trigger={trigger}
          maxLength={20}
        />

        <InputField
          label="Date of Birth"
          id="date_of_birth"
          type="date"
          max={maxDate}
          maxLength={10}
          register={register}
          errors={errors}
          trigger={trigger}
        />

        <InputField
          label="Weight (in kg)"
          id="weight"
          type="number"
          register={register}
          errors={errors}
          trigger={trigger}
          min={0}
          maxLength={3}
        />

        <InputField
          label="Height (in feet)"
          id="height"
          type="text"
          min={0}
          register={register}
          errors={errors}
          trigger={trigger}
          maxLength={5}
        />

        <div className="input_label">
          <label>Country of Origin</label>
          <Controller
            name="country_of_origin"
            control={control}
            rules={{ required: "Country is required" }}
            render={({ field }) => (
              <Select
                options={options}
                value={options.find((option) => option.value === field.value)}
                onChange={(option) => field.onChange(option.value)}
                styles={selectStyle}
              />
            )}
          />
          <p className="auth-error">
            {errors.country_of_origin && errors.country_of_origin.message}
          </p>
        </div>

        <div className="input_label">
          <label>Gender</label>
          <div className="radio-group">
            <input
              type="radio"
              id="male"
              value="male"
              name="gender"
              {...register("gender", { required: "Gender is required" })}
            />
            <label htmlFor="male">Male</label>
            <input
              type="radio"
              id="female"
              value="female"
              name="gender"
              {...register("gender", { required: "Gender is required" })}
            />
            <label htmlFor="female">Female</label>
          </div>
          <p className="auth-error">{errors.gender && errors.gender.message}</p>
        </div>

        <div className="conditions">
          <p className="subheading">
            Do you have any of the following medical conditions?
          </p>
          <div className="check-cont">
          <div className="input_label check">
            <label>Diabetic</label>
            <input type="checkbox" {...register("is_diabetic")} />
          </div>
          <div className="input_label check">
            <label>Cardiac</label>
            <input type="checkbox" {...register("cardiac_issue")} />
          </div>
          <div className="input_label check">
            <label>Blood Pressure</label>
            <input type="checkbox" {...register("blood_pressure")} />
          </div>
          </div>
        </div>
      </div>

      <Button hide={false} setShowEditForm={setShowEditForm} />
    </form>
  );
};

PersonalInfo.propTypes = {
  onNext: PropTypes.func,
  onBack: PropTypes.func,
  formData: PropTypes.object,
  id: PropTypes.string,
  setFormData: PropTypes.func,
  setShowEditForm: PropTypes.func,
};

export default PersonalInfo;
