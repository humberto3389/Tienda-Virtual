export default function LoadingSpinner({ size = "md", color = "indigo" }) {
  const sizes = {
    sm: "40px",
    md: "64px",
    lg: "96px",
    xl: "128px"
  };

  const containerSize = sizes[size] || sizes.md;
  const innerSize = `calc(${containerSize} / 2)`;
  const borderWidth = size === "sm" ? "2px" : "3px";

  return (
    <div className="flex items-center justify-center">
      <div className="custom-loader">
        <style dangerouslySetInnerHTML={{ __html: `
          .custom-loader {
            width: ${containerSize};
            height: ${containerSize};
            border: ${borderWidth} solid #FFF;
            border-style: solid solid dotted dotted;
            border-radius: 50%;
            display: inline-block;
            position: relative;
            box-sizing: border-box;
            animation: rotation 2s linear infinite;
          }
          .custom-loader::after {
            content: '';  
            box-sizing: border-box;
            position: absolute;
            left: 0;
            right: 0;
            top: 0;
            bottom: 0;
            margin: auto;
            border: ${borderWidth} solid #FF854D;
            border-style: solid solid dotted;
            width: ${innerSize};
            height: ${innerSize};
            border-radius: 50%;
            animation: rotationBack 1s linear infinite;
            transform-origin: center center;
          }
              
          @keyframes rotation {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          } 
          @keyframes rotationBack {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(-360deg); }
          }
        ` }} />
      </div>
    </div>
  );
}