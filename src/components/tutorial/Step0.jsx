import Logo from "../../assets/Logo.svg";
import pohang from "../../assets/pohang.svg";
import posco from "../../assets/posco.svg";

function Step0() {
  return (
    <div className="w-full min-h-screen flex flex-col items-center bg-[#151515]">
      <div className="flex justify-center items-center mt-60">
        <img src={Logo} alt="logo" className="w-[124px]" />
      </div>{" "}
      <div className="flex justify-center items-center mt-60">
        <img src={posco} alt="posco" className="mr-3" />
        <img src={pohang} alt="pohang" />
      </div>
    </div>
  );
}

export default Step0;
