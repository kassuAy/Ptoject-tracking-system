import { AiOutlineMail, AiOutlineUnlock } from 'react-icons/ai';
import { RiLockPasswordLine } from 'react-icons/ri';

import React, { useState } from 'react';
import { InputErrors } from '../../types/error';
import { getErrorMsg } from '../../helpers';
import { useRouter } from 'next/router';
import axios, { Axios, AxiosError } from 'axios';
import { ErrorText } from './InputFeildElements';
// import useState from '../../node_modules/react/index'
import { isEmptyBindingElement } from 'typescript';
import { trusted } from 'mongoose';

import { Form, FormTitle, Link } from './FormElements';
import Button from '../Button';
type Props = {};

const Project_submissionForm = () => {
  const [formData, setData] = useState({
    project_title: '',
    description: '',
    accademicYear: '',
   
    projectFileName: '',
  });
  const [validationErrors, setValidationErrors] = useState<InputErrors[]>([]);
  const [submitError, setSubmitError] = useState<string>('');
  const [loading, setloading] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState(null);
  const [cancelTokenSource, setCancelTokenSource] = useState(null);
  const [file, setFile] = useState(null);
  const router = useRouter();

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };
 
  const validateData = (): boolean => {
    const err = [];
    
    if (formData.project_title?.length == 0) {
        err.push({ project_title: "this field can't be empty" });
    } 
    else if (formData.project_title?.length < 10) {
      err.push({ project_title: 'please enter well defined title' });
    } 
    else if (formData.description?.length == 0) {
      err.push({ description: 'please enter your project description' });
    } 
    else if (formData.accademicYear?.length == 0) {
      err.push({ accademicYear: 'please enter the date' });
    } 
    
    else {
      
        if (!file) {
          err.push({ projectFileName: 'Please choose a file' });
          setSelectedFile(null);
        }
         else {
          err.push(null);
          setSelectedFile(file);
        }
      
    }
    setValidationErrors(err);
    if (err.length > 0) {
      return false;
    }
    else {
      return true;
    }
  };

  const handleUploading = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const isValid = validateData();

    if (isValid) {
      //uploading project
      try {
        setloading(true);
        const apiRes = await axios.post(
          'http:localhost:3000/api/auth/uploadFinalProject',
          formData
        );
        if (apiRes?.data?.success) {
          //save data in session using next auth
          router.push('/');
        }
      } catch (error: unknown) {
        if (error instanceof AxiosError) {
          const errorMsg = error.response?.data?.error;
          setSubmitError(errorMsg);
        }
      }
      setloading(false);
    }
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    // we get the propery name from event.target.name and set the value from
    //onchange in it so, name is our input component should be
    //the same as the proprety in data state

    setData({ ...formData, [event.target.name]: event.target.value });
  };
  const handleTextAreaInput = (
    event: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    setData({ ...formData, [event.target.name]: event.target.value });
  };



  const handleUpload = async () => {
    if (!file) {
      return;
    }

    setUploading(true);
    setUploadProgress(0);
    setUploadError(null);
    try {
        const response = await axios.post('/api/upload', formData, {
          cancelToken: source.token,
          onUploadProgress: (progressEvent) => {
            const percentCompleted = Math.round(
              (progressEvent.loaded * 100) / progressEvent.total
            );
            setUploadProgress(percentCompleted);
          },
        });
  
        console.log('Upload successful!', response.data);
      } catch (error) {
        if (axios.isCancel(error)) {
          console.log('Upload canceled by user.');
        } else {
          setUploadError(error);
          console.error('Error uploading file:', error);
        }
      } finally {
        setUploading(false);
        setCancelTokenSource(null);
      }
    };
  
    const handleCancel = () => {
      if (cancelTokenSource) {
        cancelTokenSource.cancel('Upload canceled by user.');
      }
    };




  return (
    <div
      className="relative p-12 mt-[-50px] mb-[-50px] px-[30%]"
      style={{ height: '49.5rem'}}
    >
      <main className=" bg-[#C0C0C0] absolute p-12 text-center justify-center">
        <form className="relative  w-full h-full " onSubmit={handleUploading}>
          <h1 className="h3 mb-3 fw-normal">Upload final Project</h1>
          <div className="flex flex-col justify-center items-centr">
            
            <div className="form-floating flex flex-row">
              
              <label htmlFor="floatingInput">Project Title</label>
            <span><input
                type="text"
                className="form-control py-2 px-3 ml-10 w-full h-full"
                name="project_title"
                value={formData.project_title}
                onChange={handleInputChange}
                required
              /></span> 
              {/* id="floatingInput" */}
            </div>
            <br /> 
            <div className="form-floating flex flex-row ">
              <label htmlFor="floatingInput">Description:</label>
              <textarea
                typeof="text"
                className="form-control py-4 px-3 ml-10 w-full h-full"
                placeholder="enter your project asbstruct "
                name="description"
                value={formData.description}
                onChange={handleTextAreaInput}
                required
              />
            </div>

            <div className="form-floating flex flex-row mt-10 w-[-40px]">
             
              <label htmlFor="floatingInput">Accademic Year:</label>
              <span><input
                className="form-control px-10"
                type="date"
                name="accademicYear"
                value={formData.accademicYear}
                onChange={handleInputChange}
                required
              /></span>
            </div>
            <br />
            
            <div className="py-10 flex flex-row w-full h-full">
              <label>project file</label>
              <span>
              <input
                className="form-control py-2 px-3 ml-10 w-full h-full "
                type="file"
                name="projectFileName"
                value={formData.projectFileName}
                onChange={handleFileChange}
                required
              />
              </span>
            </div>
          </div>
          <button
            className="bg-blue-700 rounded text-white text-sm px-4 py-2 border-2 border-gray shadow hover:shadow-lg outline-none focus:outline-none"
            type="submit"
            disabled={loading}
          >
            Submit
          </button>
          <button
           onClick={handleCancel}
           disabled={!uploading}
           className='bg-red-700 rounded text-white text-sm px-4 py-2 border-2 border-gray shadow hover:shadow-lg outline-none focus:outline-none'>
        Cancel
      </button>
          {submitError && <ErrorText>{submitError}</ErrorText>}
        </form>
      </main>
    </div>
  );
};

export default Project_submissionForm;
