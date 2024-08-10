import { atom } from "recoil";

export const departureState = atom({
  key: "departureState",
  default: "",
});

export const destinationState = atom({
  key: "destinationState",
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

export const isArrivedState = atom({
  key: "isArrivedState",
  default: true,
});
