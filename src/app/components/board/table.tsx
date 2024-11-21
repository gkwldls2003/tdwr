
export default function Table({ children } : { children: React.ReactNode }) {
  return (
    <table className="w-full text-md bg-white shadow-md rounded mb-4">
      {children}
    </table>
  );
}