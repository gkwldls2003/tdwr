
export default function Th( { th }: { th: string[] } ) {
  return (
    <>
    <tr className="border-b">
      {
        
        th.map((th: string, idx: number) => {
          return <th key={idx} className="p-3 px-5">{th}</th>;
        })
       
      }
    </tr>
    </>
  );
}