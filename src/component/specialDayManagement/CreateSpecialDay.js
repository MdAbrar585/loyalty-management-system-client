import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import specialDay from "../../assets/logo/special_day.gif";
import { yupResolver } from "@hookform/resolvers/yup";
import { useAlert } from "react-alert";
import * as Yup from "yup";
// import { useAlert } from "react-alert";
import moment from "moment";
import {
  CLEAR_ERRORS,
} from "../../redux/constants/partnerConstant";
import {
  createSpecialDay,
  loadSpecialDay,
} from "../../redux/actions/specialDayAction";
import { CREATE_SPECIAL_DAY_RESET } from "../../redux/constants/specialDayConstant";

const CreateSpecialDay = ({ setState,pages }) => {
  var today = new Date();
  console.log(moment(today).format("YYYY-MM-DD"));

  const dispatch = useDispatch();

  const alert = useAlert();

  const [token] = useState(
    JSON.parse(localStorage.getItem("loggedInUser")) || null
  );

  // form validation rules
  const validationSchema = Yup.object().shape({
    specialDay: Yup.string().required("Special day is required"),
    message: Yup.string().required("Message is required"),
  });
  const formOptions = { resolver: yupResolver(validationSchema) };

  const { register, handleSubmit, formState } = useForm(formOptions);
  const { errors } = formState;

  const onSubmit = (data) => {
    console.log(data);
    console.log(data.uploadFiles[0]);
    // console.log(moment(startDate).format("YYYY-MM-DD"));
    const myForm = new FormData();

    myForm.set("name", data.specialDay);
    myForm.set("date", moment(today).format("YYYY-MM-DD"));
    myForm.set("message", data.message);
    myForm.set("image", data.uploadFiles[0]);

    dispatch(createSpecialDay(token.access_token, myForm));
  };

  const {
    createdSpecialDayError,
    createdSpecialDaySuccess,
  } = useSelector((state) => state.createSpecialDay);

  //   const { loadUserTypeData } = useSelector((state) => state.loadUserType);

  useEffect(() => {
    if (createdSpecialDayError) {
      alert.error(createdSpecialDayError.message);
      setState({ right: false });
      dispatch({ type: CLEAR_ERRORS });
    }

    if (createdSpecialDaySuccess) {
      alert.success("Special Day Created Successfully!");
      setState({ right: false });
      console.log("success", createdSpecialDaySuccess);
      dispatch({ type: CREATE_SPECIAL_DAY_RESET });

      const myForm = new FormData();
      myForm.set("per_page", 6);
      myForm.set("page_number", pages);
      
      dispatch(loadSpecialDay(token?.access_token),myForm);
    }
    // dispatch(loadUserType(token?.access_token));
  }, [
    dispatch,
    token,
    createdSpecialDaySuccess,
    createdSpecialDayError,
    alert,
    setState,
  ]);

  return (
    <div className="drawer-width-container m-4">
      <h1>Create A Wish</h1>
      <div className="d-flex justify-content-center">
        <img style={{ width: "50%" }} src={specialDay} alt="" />
      </div>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="row">
          <div className="form-group col-md-12">
            <label>Special Day Name</label>
            <input
              className={`form-control ${
                errors.specialDay ? "is-invalid" : ""
              }`}
              {...register("specialDay", { required: true })}
              placeholder="Special Day Name"
            />
            <span className="invalid-feedback text-danger">
              {errors.specialDay?.message}
            </span>
          </div>

          <div className="form-group col-md-12">
            <label>Message</label>
            <textarea
              className={`form-control ${errors.message ? "is-invalid" : ""}`}
              {...register("message", { required: true })}
              placeholder="Message"
            />
            <span className="invalid-feedback text-danger">
              {errors.message?.message}
            </span>
          </div>

          {/* <div className="form-group col-md-12">
            <input
              type="file"
              className={`form-control ${errors.picture ? "is-invalid" : ""}`}
              {...register("picture", { required: true })}
              placeholder="Message"
                      />
            <label>Upload Picture</label>
                      
            <span className="invalid-feedback text-danger">
              {errors.picture?.message}
            </span>
          </div> */}

          <div id="uploadField" className="form-group col-md-12">
            <label>Upload Picture</label>
            <input
              id="file"
              style={{ border: "dashed #023047" }}
              className="form-control"
              {...register("uploadFiles", { required: false })}
              placeholder="Upload Files"
              type="file"
              //   onChange={() => Filevalidation()}
            />
            <span style={{ fontSize: "12px", color: "red" }}>
              **Max Image Resolution : 1920 X 1080px Max Image Size : 10MB
            </span>
            <span className="text-danger">
              {errors.uploadFiles?.type === "required" &&
                "Upload Files is required"}
            </span>
          </div>
        </div>
        <div className="col-md-12">
          <input
            className="add-user-button text-center"
            type="submit"
            value="Create A Wish"
          />
        </div>
      </form>
    </div>
  );
};

export default CreateSpecialDay;
