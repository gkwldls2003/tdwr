
export default function Colgroup( { colgroup }: { colgroup: string[] } ) {
  return (
    <>
      <colgroup>
      {
        colgroup.map((col: string, idx: number) => {
          return <col key={idx} width={col}></col>;
        })
      }
      </colgroup>
    </>
  );
}