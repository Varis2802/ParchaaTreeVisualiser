import React, { useEffect, useRef, useState } from "react";
import Sidebar from "../../../Components/Sidebar";
import "./before7level.css";
import "../index.css";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import { CCAPI } from "../../../APIS";
function Before7levelPage() {
  const [cc, setCC] = useState("");
  const [allCC, setAllcc] = useState([]);
  const [diagnosis, setDiagnosis] = useState([]);
  // logic for allcc

  useEffect(() => {
    const url = `http://localhost:7000/cc_diag/get-all`;
    axios
      .get(url)
      .then((response) => {
        console.log("Data received:", response.data);
        setAllcc(response.data);
        console.log(allCC);
      })
      .catch((error) => {
        // Handle errors
        console.error("Error fetching data:", error);
      });
  }, []);


  const textareaRef1 = useRef(null); // Ref for the first textarea
  const textareaRef2 = useRef(null); // Ref for the second textarea
  

  const handleCopyClick1 = () => {

   
    if (textareaRef1.current) {
      const textToCopy = textareaRef1.current.value;
      if (textToCopy.trim() === "") {
        toast.error("Textarea is empty. Enter some text to copy.");
        return;
      }

      textareaRef1.current.select();
      try {
        document.execCommand("copy");
        toast.success("Text copied to clipboard!");
      } catch (error) {
        console.error("Unable to copy text:", error);
      }
      window.getSelection().removeAllRanges();
    }

  };

  const handleCopyClick2 = () => {
    if (textareaRef2.current) {
      const textToCopy = textareaRef2.current.value;
      if (textToCopy.trim() === "") {
        toast.error("Textarea is empty. Enter some text to copy.");
        return;
      }

      textareaRef2.current.select();
      try {
        document.execCommand("copy");
        toast.success("Text copied to clipboard!");
      } catch (error) {
        console.error("Unable to copy text:", error);
      }
      window.getSelection().removeAllRanges();
    }
  };



  const handleDownloadClick = () => {
    if (textareaRef2.current) {
      const textToSave = textareaRef2.current.value;
      if (textToSave.trim() === "") {
        toast.error("Textarea is empty. Enter some text to download.");
        return;
      }

      const blob = new Blob([textToSave], { type: "text/plain" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "text_file.txt";
      document.body.appendChild(a);
      a.click();
      URL.revokeObjectURL(url);
      document.body.removeChild(a);

      const updatedData = {
        initial_levels: true,
      };

      // Send the PATCH request using Axios
      axios
        .patch(`http://localhost:7000/cc-status/${cc}`, updatedData)
        .then((response) => {
          toast.success("Successfully updated");
        })
        .catch((error) => {
          toast.error("Error updating");
        });
    }
  };

  // Event handler for cc dropdown change
  const handleCCChange = (event) => {
    setCC(event.target.value);
    const cc = event.target.value;
    const filtereddiagnosis = allCC.filter(
      (data) => data.chief_complaint == cc
    );
    console.log(filtereddiagnosis, "filtereddiagnosis ");
    setDiagnosis(filtereddiagnosis[0]?.diagnosis_list);
    console.log(diagnosis, "diagnosis");
  };


  const handlegptBtn = () => {
    // Data you want to update
    const updatedData = {
      status: "Stopped",
    };

    // Send the PATCH request using Axios
    axios
      .patch(`http://localhost:7000/cc-status/${cc}`, updatedData)
      .then((response) => {
        toast.success("Successfully updated");
      })
      .catch((error) => {
        toast.error("Error updating");
      });
  };

  return (
    <div style={{ display: "flex" }}>
      <ToastContainer />
      <Sidebar />
      <div className="dashboard-page-right-container">
        <div className="form-container">
          <form>
            <label htmlFor="cc">Select Chief complaint:</label>
            <select
              id="cc"
              name="cc"
              className="dropdown"
              value={cc}
              onChange={handleCCChange}
            >
              {allCC?.map((cc) => {
                return (
                  <option value={cc.chief_complaint}>
                    {cc.chief_complaint}
                  </option>
                );
              })}

              {/* <option value="option2">Option 2</option>
              <option value="option3">Option 3</option> */}
            </select>
            
            <label htmlFor="promot">Prompt</label>
            <textarea
              id="promot"
              placeholder="Enter Prompt"
              className="text-area"
              ref={textareaRef1}
              value=
              {`Generate a comprehensive decision tree for diagnosing the cause of the chief complaint ${cc}using a breadth-first search method. The decision tree should be restricted to a depth of 10-12 levels, starting from general questions and progressing towards more medically-specific inquiries. The possible diagnoses to be considered are in list below:
                [${diagnosis.toString()}]
              The decision tree should consider patient demographics, medical history, diet, lifestyle, medications, and symptoms. The format should begin with basic questions, gradually transitioning to more specific and medically-related inquiries. At each level, provide multiple user options, ensuring that all choices are explored in a breadth-first search manner while maintaining a depth of 10-12 levels for each path. The final diagnosis should be one from the list provided and reached at the end of each path once the depth is achieved. The response should strictly follow the given format without any additional explanations or context. The decision tree format is: { 'queid': 'QID','question' : 'text', 'options' : { 'opText1':'nextQID', 'opText2':'nextQID',...}, 'level':'number'}, {....}, ... . Only generate the first 3 levels. The questions should collect enough data for the analysis instead of merely yes or no questions. The options dictionary should map to the next question ID. If any option leads to a question with the same text and options as a previous question, generate a new question with a different ID rather than reusing the old one.`
               }
            />
            
            <button type="button" onClick={handleCopyClick1}>Copy</button>

            <a
              href="https://chat.openai.com/"
              target="_blank"
              className="gpt-btn"
              onClick={handlegptBtn}
            >
              Go to ChatGpt
            </a>
            <label htmlFor="prompt-text">Enter text:</label>
            <textarea
              id="prompt-text"
              name="prompt-text"
              placeholder="Type something..."
              ref={textareaRef2}
              className="text-area"
            />
            <div className="button-container">
              <button type="button" onClick={handleCopyClick2}>
                Copy Text
              </button>
              <button type="button" onClick={handleDownloadClick}>
                Download Text
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Before7levelPage;
