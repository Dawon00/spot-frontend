import step9 from "../../assets/Step9.svg";
import PopUp from "../PopUp";
import WideButton from "../WideButton";
import { useNavigate } from "react-router-dom";

function Step9() {
  const navigate = useNavigate();

  const handleButtonClick = () => {
    navigate("/map");
  };

  return (
    <div className="relative w-full h-full">
      <img src={step9} alt="Step9" className="w-full h-full object-cover" />
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
        <PopUp>
          <div className="space-y-2">
            <h3 className="text-xl font-bold leading-tight">
              Congratulations!
            </h3>
            <p className="text-sm font-normal text-[#B9B9B9] leading-[14px]">
              Completed the tutorial!
            </p>
            <div className="divider my-2 before:bg-[#585858] after:bg-[#585858]"></div>
            <p className="text-sm font-normal text-[#B9B9B9] leading-[14px]">
              SPOT can be used only
            </p>
            <p className="text-sm font-normal text-[#B9B9B9] leading-[14px]">
              when location information is provided
            </p>
          </div>
        </PopUp>
        <div className="mt-4 w-full">
          <WideButton onClick={handleButtonClick}>Accept and Start</WideButton>
        </div>{" "}
      </div>{" "}
    </div>
  );
}

export default Step9;
