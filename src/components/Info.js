// styles
import "../styles/Info.min.css";

const Info = ({ text }) => {
  return (
    <div id="infobox" key={text[0].header}>
      {text.map((paragraph, i) => (
        <div key={`paragraph${i}`}>
          <h2 className="infoheader" key={`header${i}`}>
            {paragraph.header}
          </h2>
          <hr key={`hr${i}`} />
          {paragraph.body.map((phrase, j) => (
            <p key={`phrase${j}`}>
              {(() => {
                if (!Array.isArray(phrase))
                  return <span key={`phrase${j}`}>{phrase}</span>;
                return phrase.map((subphrase, k) => {
                  if (!Array.isArray(subphrase))
                    return <span key={`subphrase${k}`}>{subphrase}</span>;
                  return subphrase.map((subsubphrase, l) => (
                    <span key={`subsubphrase${l}`}>{subsubphrase}</span>
                  ));
                });
              })()}
            </p>
          ))}
        </div>
      ))}
    </div>
  );
};

export default Info;
