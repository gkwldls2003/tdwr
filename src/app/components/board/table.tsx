
export default function Table({ children } : { children: React.ReactNode }) {
  return (
    <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400 mt-4">
      {children}
    </table>
  );
}