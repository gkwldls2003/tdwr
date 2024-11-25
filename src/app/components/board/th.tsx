
export default function Th( { th }: { th: string[] } ) {
  return (
    <>
    <tr className="bg-gray-100">
      {
        
        th.map((th: string, idx: number) => {
          return <th key={idx} className="p-3 px-5 text-center">{th}</th>;
        })
       
      }
    </tr>
    </>
  );
}