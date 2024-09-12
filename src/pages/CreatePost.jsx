import React from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import "./CreatePost.css";
import * as Yup from "yup";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function CreatePost() {
  const navigate = useNavigate();

  const initialValues = {
    title: "",
    posttext: "",
  };

  const validationSchema = Yup.object({
    title: Yup.string().required("Title is required"),
    posttext: Yup.string().required("Post Text is required"),
  });

  const onSubmit = async (data, { setSubmitting, resetForm }) => {
    try {
      const response = await axios.post("https://blog-backend-k2au2wpqn-paras-sharma-s-projects-55e1989b.vercel.app//posts", data, {
        headers: { accessToken: localStorage.getItem("accessToken") },
      });

      if (response.data.error) {
        alert("You must be logged in to create a new post.");
      } else {
        resetForm();
        navigate("/"); // Redirect to home page after successful submission
      }
    } catch (error) {
      console.error("Error submitting form data:", error);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <div className="create-post-container">
        <h2>Create New Post</h2>
        <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={onSubmit}>
          {({ isSubmitting }) => (
            <Form>
              <div className="form-group">
                <label htmlFor="title">Title</label>
                <Field type="text" id="title" name="title" className="input-field" />
                <ErrorMessage name="title" component="div" className="error-message" />
              </div>

              <div className="form-group">
                <label htmlFor="posttext">Post Text</label>
                <Field as="textarea" id="posttext" name="posttext" minLength={30} className="input-field" />
                <ErrorMessage name="posttext" component="div" className="error-message" />
              </div>

              <button type="submit" className="submit-button" >
                {isSubmitting ? "Submitting..." : "Submit"}
              </button>
            </Form>
          )}
        </Formik>
      </div>
    </>
  );
}

export default CreatePost;