import Image from 'next/image'
export default function PhotoSpotGrid(props: { photospots: any[]; }) {
  const n = 3;
  const photospots_grouped = props.photospots.reduce((r: any, e: any, i: any) => (i % n ? r[r.length - 1].push(e) : r.push([e])) && r , []);
  let out = (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {
        photospots_grouped.map((photospot_group: any) => {
         return ( 
          <div className="grid gap-4">
            {
              photospot_group.map((photospot:any) => {
                return (
                <div className="">
                  <Image className="h-auto max-w-full rounded-lg" width={300} height={300} alt={photospot.name} src={photospot.photo_path} />
                </div>
                )
              })
            }
          </div>);
        })
      }
    </div>
  );
  return out
}