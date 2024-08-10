import { atom } from "recoil";


export const departureState = atom({
  key: "departureState",
  default: "",
});

export const destinationState = atom({
  key: "destinationState",
  default: "",
});

export const beforeState = atom({
  key: "beforeState",
  default: ""
})

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
  default: false
})

export const markerState = atom({
  key: "markerState",
  default: []
})