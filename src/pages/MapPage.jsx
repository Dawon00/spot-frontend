import React, { useState } from "react";
import TmapComponent from "../components/TmapComponent";
import { useForm } from "react-hook-form";
import axios from "axios";
import LocationSelector from "../components/LocationSelector";
import { isArrivedState } from "../atom/mapState";
import { useRecoilState } from "recoil";
import PopUp from "../components/PopUp";
import Button from "../components/Button";
import { useNavigate } from "react-router-dom";

const MapPage = () => {
  const [isArrived] = useRecoilState(isArrivedState);
  const navigate = useNavigate()
  return (
    <div className="min-h-screen">
      <TmapComponent />
      {isArrived && (
        <div className="absolute w-full inset-0 flex items-center justify-center z-50">
          <div className="max-w-sm">
            <PopUp>
              <div className="space-y-2">
                <h3 className="text-xl font-bold leading-tight">
                  Finally Arrived!
                </h3>
                <p className="text-sm font-normal text-[#B9B9B9] leading-[14px]">
                  Is route was comfortable to you?
                </p>
                <div className="h-[1px] w-[290px] bg-[#585858]"></div>
                <p className="text-sm font-normal text-[#B9B9B9] leading-[14px]">
                  This answer will be the data for
                </p>
                <p className="text-sm font-normal text-[#B9B9B9] leading-[14px]">
                  more concrete expectation!
                </p>
              </div>
            </PopUp>

            <div className="mt-4 w-[290px] flex justify-between">
              <Button isActived={false} onClick={() => navigate("/")}>No</Button>
              <Button onClick={() => navigate("/")}>Yes</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MapPage;
