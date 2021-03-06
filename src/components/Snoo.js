// styles
import "../styles/Snoo.min.css";

const Snoo = ({ spinning }) => {
  return (
    <div id="spinner">
      <div className={`antenna${spinning && " spinning"}`}>
        <div className="angle" />
        <div className="bobble" />
      </div>
      <div className="spinnero" />
    </div>
  );
};

export default Snoo;
