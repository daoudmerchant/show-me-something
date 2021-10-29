import "../styles/Info.css";

const Info = ({ text }) => {
  return (
    <div id="infobox">
      {text.map((paragraph) => (
        <>
          <h2 className="infoheader">{paragraph.header}</h2>
          <hr />
          {paragraph.body.map((phrase) => (
            <p>{phrase}</p>
          ))}
        </>
      ))}
    </div>
  );
};

export default Info;
