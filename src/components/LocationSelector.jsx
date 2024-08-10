import { useEffect, useState } from "react";
import close from "../assets/Close.svg";
import blueDot from "../assets/blue_dot.svg";
import greenDot from "../assets/green_dot.svg";
import logoColorful from "../assets/logo_colorful.svg";
import LoadingBar from "./LoadingBar";
import { useRecoilState } from "recoil";
import { departureState, destinationState, initialState } from "../atom/mapState";

function LocationSelector() {
  const [isLocationReady, setIsLocationReady] = useState(false);
  const [start, setStart] = useState("신평동"); // 출발지로 설정된 장소
  const [end, setEnd] = useState("경주 힐튼 호텔"); // 도착지로 설정된 장소

  const [dep, setDep] = useRecoilState(departureState)
  const [dest, setDest] = useRecoilState(destinationState)
  const [initial, setinitial] = useRecoilState(initialState)

  useEffect(() => {
    if (dep === "") {
      setDep(initial.stateName)
      return
    }

    if (dest === "") {
      setDest(initial.stateName)
      return
    }
  }, [])

  return (
    <div className="pt-10 flex absolute top-0 left-0 right-0 bg-[#4D4D4D] bg-opacity-70 backdrop-blur-md  text-white p-6 rounded-b-3xl">
      <div className="flex flex-col justify-end w-full">
        <div className="flex">
          <div className="flex-1 pr-6">
            {" "}
            <div className="flex items-center mb-2">
              {isLocationReady ? (
                <img src={blueDot} alt="blueDot" className="w-3 h-4 mr-3" />
              ) : (
                <span className="mr-3">출발</span>
              )}

              {isLocationReady ? (
                <span className="text-white">{start}</span>
              ) : (
                <button onClick={() => { }} className="text-[#B9B9B9]">
                  {dep}
                </button>
              )}
            </div>
            <div className="flex items-center">
              {isLocationReady ? (
                <img src={greenDot} alt="greenDot" className="w-3 h-4 mr-3" />
              ) : (
                <span className="mr-3">도착</span>
              )}{" "}
              {isLocationReady ? (
                <span className="text-white">{end}</span>
              ) : (
                <button onClick={() => { }} className="text-[#B9B9B9]">
                  {dest}
                </button>
              )}
            </div>
          </div>
          {isLocationReady ? (
            <img src={logoColorful} className="w-16 h-16" />
          ) : (
            <img
              src={close}
              alt="close"
              className="w-4 h-4"
              onClick={() => { }}
            />
          )}
        </div>
        {isLocationReady && (
          <div>
            <div className="h-[1px] w-full px-4 my-4 bg-[#585858]"></div>
            <div className="flex">
              <div className="mr-4">12km</div>
              <LoadingBar isReady={isLocationReady} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default LocationSelector;
