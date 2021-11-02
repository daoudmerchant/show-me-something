// styles
import "../styles/Info.min.css";

const Info = ({ text }) => {
  return (
    <div id="infobox">
      {text.map((paragraph, i) => (
        <div key={`paragraph${i}`}>
          <h2 className="infoheader" key={`header${i}`}>
            {paragraph.header}
          </h2>
          <hr key={`hr${i}`} />
          {paragraph.body.map((phrase, j) => (
            <p key={`phrase${i}-${j}`}>{phrase}</p>
          ))}
        </div>
      ))}
    </div>
  );
};

export default Info;
