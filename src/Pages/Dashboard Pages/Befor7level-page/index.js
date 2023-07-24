import React, { useRef, useState } from "react";
import Sidebar from "../../../Components/Sidebar";
import "./before7level.css";
import "../index.css";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
function Before7levelPage() {
  const [cc, setCC] = useState("");
  const [digo, setDign] = useState("");

  const textareaRef = useRef(null);

  const handleCopyClick = () => {
    if (textareaRef.current) {
      const textToCopy = textareaRef.current.value;
      if (textToCopy.trim() === "") {
        toast.error("Textarea is empty. Enter some text to copy.");
        return;
      }

      textareaRef.current.select();
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
    if (textareaRef.current) {
      const textToSave = textareaRef.current.value;
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
    }
  };

  // Event handler for cc dropdown change
  const handleCCChange = (event) => {
    setCC(event.target.value);
  };

  // Event handler for diagnosis dropdown change
  const handleDiagnosisChange = (event) => {
    setDign(event.target.value);
  };

  const diagnosis = [
    "Gastritis",
    "Peptic ulcer disease",
    "Gastroenteritis",
    "Irritable bowel syndrome (IBS)",
    "Gallstones (cholelithiasis)",
    "Appendicitis",
    "Pancreatitis",
    "Diverticulitis",
    "Kidney stones (nephrolithiasis)",
    "Urinary tract infection (UTI)",
    "Gastroesophageal reflux disease (GERD)",
    "Colitis",
    "Crohn's disease",
    "Ulcerative colitis",
    "Constipation",
    "Inflammatory bowel disease (IBD)",
    "Ovarian cyst",
    "Ectopic pregnancy",
    "Pelvic inflammatory disease (PID)",
    "Endometriosis",
    "Hernia",
    "Intestinal obstruction",
    "Gastrointestinal bleeding",
    "Celiac disease",
  ];

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
              <option value="BackPain">Back Pain</option>
              <option value="option2">Option 2</option>
              <option value="option3">Option 3</option>
            </select>
            <label htmlFor="diagnosis">Select diagnosis:</label>
            <select
              id="diagnosis"
              name="diagnosis"
              className="dropdown"
              onChange={handleDiagnosisChange}
            >
              {diagnosis.map((dig, i) => {
                return (
                  <option value={dig} key={i}>
                    {dig}
                  </option>
                );
              })}
            </select>
            <label htmlFor="promot">Prompt</label>
            <input
              type="text"
              id="promot"
              placeholder="Enter Prompt"
              className="input-box"
              value={cc + " " + digo}
            />
            <a
              href="https://chat.openai.com/"
              target="_blank"
              className="gpt-btn"
            >
              Go to ChatGpt
            </a>
            <label htmlFor="prompt-text">Enter text:</label>
            <textarea
              id="prompt-text"
              name="prompt-text"
              placeholder="Type something..."
              ref={textareaRef}
              className="text-area"
            ></textarea>
            <div className="button-container">
              <button type="button" onClick={handleCopyClick}>
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
