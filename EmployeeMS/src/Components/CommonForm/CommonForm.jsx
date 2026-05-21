import "./CommonForm.css";
import { Eye, User, Mail, Briefcase } from "lucide-react";

const CommonForm = ({
  title,
  children,
  onSubmit,
  submitText = "Submit",
  cancelText,
  onCancel,
}) => {
  return (
    <div className="commonform-page">
      <div className="commonform-card">

        {title && (
          <h2 className="commonform-title">
            {title}
          </h2>
        )}

        <form onSubmit={onSubmit} className="commonform-form">

          <div className="commonform-grid">
            {children}
          </div>

          <div className="commonform-actions">

            {cancelText && (
           <button
  type="submit"
  className="commonform-submit"
  onClick={() => console.log("BUTTON CLICKED")}
>
  {submitText}
</button>
            )}

            <button
              type="submit"
              className="commonform-submit"
            >
              {submitText}
            </button>


          </div>

        </form>
      </div>
      
    </div>
  );
};

export default CommonForm;