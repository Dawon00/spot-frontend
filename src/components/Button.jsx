export default function Button({ children, onClick, isActived = true }) {
  const backgroundClass = isActived
    ? "bg-gradient-to-r from-blue-400 to-green-400"
    : "bg-[#B9B9B9]";

  return (
    <button
      onClick={onClick}
      className={`btn w-[140px] text-black border-none ${backgroundClass}`}
    >
      {children}
    </button>
  );
}
