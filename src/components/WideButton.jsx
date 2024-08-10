export default function WideButton({ children, onClick }) {
  return (
    <button
      onClick={onClick}
      className="btn btn-block bg-gradient-to-r from-blue-400 to-green-400 text-black border-none"
    >
      {children}
    </button>
  );
}
