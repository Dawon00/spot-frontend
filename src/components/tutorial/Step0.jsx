import Logo from "../../assets/Logo.svg";
import pohang from "../../assets/pohang.svg";
import posco from "../../assets/posco.svg";

function Step0() {
  return (
    <div className="w-full min-h-screen flex flex-col justify-center items-center bg-[#151515]">
      <div className="flex justify-center items-center">
        <img src={Logo} alt="logo" className="w-[124px]" />
      </div>{" "}
    </div>
  );
}

export default Step0;
