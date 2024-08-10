import React, { useState } from "react";
import TmapComponent from "../components/TmapComponent";
import { useForm } from "react-hook-form";
import axios from "axios";
import LocationSelector from "../components/LocationSelector";
import { isArrivedState } from "../atom/mapState";
import { useRecoilState } from "recoil";
import PopUp from "../components/PopUp";
import Button from "../components/Button";

const MapPage = () => {
  const [isArrived] = useRecoilState(isArrivedState);
  return (
    <div className="min-h-screen">
      <TmapComponent />
      {isArrived && (
        <div className="absolute w-full inset-0 flex items-center justify-center z-50">
          <div className="max-w-sm">
            <PopUp>
              <div className="space-y-2">
                <h3 className="text-xl font-bold leading-tight">
                  도착했습니다!
                </h3>
                <p className="text-sm font-normal text-[#B9B9B9] leading-[14px]">
                  경로는 쾌적했나요?
                </p>
                <div className="h-[1px] w-[290px] bg-[#585858]"></div>
                <p className="text-sm font-normal text-[#B9B9B9] leading-[14px]">
                  여러분의 목소리로
                </p>
                <p className="text-sm font-normal text-[#B9B9B9] leading-[14px]">
                  더 나은 장소를 제공할게요!
                </p>
              </div>
            </PopUp>

            <div className="mt-4 w-[290px] flex justify-between">
              <Button isActived={false}>별로예요</Button>
              <Button>좋았어요</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MapPage;
