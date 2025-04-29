import React, { useEffect, useMemo } from "react";
import { useForm, Controller } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import {
  getFamilyInfo,
  updateFamilyInfo,
  addFamilyInfo,
} from "../../../redux/thunks/patient";
import Button from "../../../components/formButton/FormButton";
import Select from "react-select";
import countryList from "react-select-country-list";
import InputField from "../../../components/inputField/InputField";
import PropTypes from "prop-types";
import { selectStyle } from "../../../utils/selectStyle";

const FamilyInfo = ({
  onNext,
  onBack,
  formData,
  setFormData,
  id,
  setShowEditForm,
}) => {
  const { patientId } = useSelector((state) => state.patient);
  const dispatch = useDispatch();

  const {
    register,
    handleSubmit,
    formState: { errors },
    trigger,
    control,
    reset,
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
    if (id || patientId) {
      const fetchId = id || patientId;
      dispatch(getFamilyInfo(fetchId)).then((response) => {
        if (response.payload) {
          reset(response.payload.data[0]);
          setFormData({ ...formData, familyInfo: response.payload.data[0] });
        }
      });
    }
  }, [id, patientId, dispatch, reset, setFormData]);

  const onSubmit = async (data) => {
    try {
      const addPayload = { familyDetails: { ...data, patient_id: patientId } };
      let updatePayload = { ...data, patient_id: patientId || id };

      let result;
      if (id) {
        result = await dispatch(updateFamilyInfo(updatePayload));
        setShowEditForm(false);
      } else if (formData && Object.keys(formData).length > 0) {
        result = await dispatch(updateFamilyInfo(updatePayload));
      } else {
        result = await dispatch(addFamilyInfo(addPayload));
      }

      if (result.error) {
        console.error(result.error);
        return;
      } else {
        onNext({ familyInfo: data });
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="patient_form">
      <h2>Family Information</h2>
      <div className="input-grid">
        <InputField
          label="Father's Name"
          id="father_name"
          type="text"
          maxLength={20}
          register={register}
          errors={errors}
          trigger={trigger}
        />

        <InputField
          label="Father's Age"
          id="father_age"
          type="number"
          register={register}
          errors={errors}
          trigger={trigger}
        />

        <div className="input_label">
          <label>Father's Country of Origin</label>
          <Controller
            name="father_country_origin"
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
            {errors.father_country_origin &&
              errors.father_country_origin.message}
          </p>
        </div>

        <InputField
          label="Mother's Name"
          id="mother_name"
          type="text"
          maxLength={20}
          register={register}
          errors={errors}
          trigger={trigger}
        />

        <InputField
          label="Mother's Age"
          id="mother_age"
          type="number"
          register={register}
          errors={errors}
          trigger={trigger}
        />

        <Controller
          name="mother_country_origin"
          control={control}
          rules={{
            required: "Country is required",
          }}
          render={({ field }) => (
            <div className="input_label">
              <label>Mother's Country of Origin</label>
              <Select
                options={options}
                value={options.find((option) => option.value === field.value)}
                onChange={(option) => field.onChange(option.value)}
                styles={selectStyle}
              />
              <p className="auth-error">
                {errors.mother_country_origin &&
                  errors.mother_country_origin.message}
              </p>
            </div>
          )}
        />

        <div className="condition-cont">
          <div className="conditions">
            <p className="subheading">Father's Medical Conditions</p>
            <div className="check-cont">
              <div className="input_label check">
                <label>Diabetic</label>
                <input
                  type="checkbox"
                  {...register("father_diabetic")}
                  onChange={(e) => {
                    const { onChange } = register("father_diabetic");
                    onChange(e);
                    trigger("father_diabetic");
                  }}
                />
              </div>
              <div className="input_label check">
                <label>Cardiac</label>
                <input
                  type="checkbox"
                  {...register("father_cardiac_issue")}
                  onChange={(e) => {
                    const { onChange } = register("father_cardiac_issue");
                    onChange(e);
                    trigger("father_cardiac_issue");
                  }}
                />
              </div>
              <div className="input_label check">
                <label>Blood Pressure</label>
                <input
                  type="checkbox"
                  {...register("father_bp")}
                  onChange={(e) => {
                    const { onChange } = register("father_bp");
                    onChange(e);
                    trigger("father_bp");
                  }}
                />
              </div>
            </div>
          </div>

          <div className="conditions">
            <p className="subheading">Mother's Medical Conditions</p>
            <div className="check-cont">
              <div className="input_label check">
                <label>Diabetic</label>
                <input
                  type="checkbox"
                  {...register("mother_diabetic")}
                  onChange={(e) => {
                    const { onChange } = register("mother_diabetic");
                    onChange(e);
                    trigger("mother_diabetic");
                  }}
                />
              </div>
              <div className="input_label check">
                <label>Cardiac</label>
                <input
                  type="checkbox"
                  {...register("mother_cardiac_issue")}
                  onChange={(e) => {
                    const { onChange } = register("mother_cardiac_issue");
                    onChange(e);
                    trigger("mother_cardiac_issue");
                  }}
                />
              </div>
              <div className="input_label check">
                <label>Blood Pressure</label>
                <input
                  type="checkbox"
                  {...register("mother_bp")}
                  onChange={(e) => {
                    const { onChange } = register("mother_bp");
                    onChange(e);
                    trigger("mother_bp");
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      <Button onBack={onBack} hide={true} setShowEditForm={setShowEditForm} />
    </form>
  );
};

FamilyInfo.propTypes = {
  onNext: PropTypes.func,
  onBack: PropTypes.func,
  formData: PropTypes.object,
  setFormData: PropTypes.func,
  id: PropTypes.string,
  setShowEditForm: PropTypes.func,
};

export default FamilyInfo;
