import step6 from "../../assets/Step6.svg";

function Step6({ onRouteChange }) {
  return (
    <div className="relative w-full h-full">
      <img src={step6} alt="Step6" className="w-full h-full object-cover" />
      <div
        className="absolute top-[340px] left-[170px]
                    text-white rounded-full py-16 px-16 cursor-pointer
                   "
        onClick={onRouteChange}
      >
        {""}
      </div>
    </div>
  );
}

export default Step6;
