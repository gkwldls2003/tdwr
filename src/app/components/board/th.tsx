
export default function Th( { th }: { th: string[] } ) {
  return (
    <>
    <tr>
    {th.map((thItem: string, idx: number) => {
          const isLast = idx === th.length - 1;
          return (
            <th
              key={idx}
              scope="col"
              className={`px-6 py-3 ${isLast ? 'text-center' : ''}`}
            >
              {thItem}
            </th>
          );
        })}
    </tr>
    </>
  );
}