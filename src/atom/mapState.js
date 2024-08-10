import { atom } from "recoil";

// 초기 주소 위도 경도
export const initialState = atom({
  key: "initialState",
  default: {
    stateName: "포항역",
    lat: 36.071593,
    lng: 129.341927,
  },
});

export const departureState = atom({
  key: "departureState",
  default: "",
});

export const destinationState = atom({
  key: "destinationState",
  default: "",
});

// 경유지
export const stopOverState = atom({
  key: "stopOverState",
  default: [],
});

export const beforeState = atom({
  key: "beforeState",
  default: "",
});

export const isSearchingState = atom({
  key: "isSearchingState",
  default: false,
});

export const searchTypeState = atom({
  key: "searchTypeState",
  default: "",
});

export const isClickDeState = atom({
  key: "isClickDeState",
  default: false,
});

//마커들의 위도 경도 받아옴
export const markerState = atom({
  key: "markerState",
  default: [],
});

export const isArrivedState = atom({
  key: "isArrivedState",
  default: false,
});
