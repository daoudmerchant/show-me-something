import "../styles/Info.css";

const Info = ({ text }) => {
  return (
    <div id="infobox">
      {text.map((paragraph, i) => (
        <>
          <h2 className="infoheader" key={`paragraph${i}`}>
            {paragraph.header}
          </h2>
          <hr key={`hr${i}`} />
          {paragraph.body.map((phrase, i) => (
            <p key={`phrase${i}`}>{phrase}</p>
          ))}
        </>
      ))}
    </div>
  );
};

export default Info;
