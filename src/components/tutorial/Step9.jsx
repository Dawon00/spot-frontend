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
            <h3 className="text-xl font-bold leading-tight">축하합니다!</h3>
            <p className="text-sm font-normal text-[#B9B9B9] leading-[14px]">
              튜토리얼을 완료하셨어요!
            </p>
            <div className="divider my-2 before:bg-[#585858] after:bg-[#585858]"></div>
            <p className="text-sm font-normal text-[#B9B9B9] leading-[14px]">
              SPOT은 위치 정보가 있어야
            </p>
            <p className="text-sm font-normal text-[#B9B9B9] leading-[14px]">
              사용 가능합니다.
            </p>
          </div>
        </PopUp>
        <div className="mt-4 w-full">
          <WideButton onClick={handleButtonClick}>동의 후 시작</WideButton>
        </div>{" "}
      </div>{" "}
    </div>
  );
}

export default Step9;
