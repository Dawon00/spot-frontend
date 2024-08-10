import React, { useState } from "react";
import TmapComponent from "../components/TmapComponent";
import { useForm } from "react-hook-form";
import axios from "axios";
import LocationSelector from "../components/LocationSelector";

const MapPage = () => {
  return (
    <div className="min-h-screen">
      {/* <TmapComponent /> */}
      <LocationSelector />
    </div>
  );
};

export default MapPage;
