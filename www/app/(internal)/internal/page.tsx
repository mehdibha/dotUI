export default function InternalPage() {

  return (
    <div className="flex h-screen justify-center items-center flex-col gap-8">

      <iframe src="/demos/tooltip" className="size-40 border" />

    </div>
  )
  // return (
  //   <div className="flex h-screen justify-center items-center flex-col gap-8">
  //     <div className="w-200 flex border *:data-[slot=input]:flex-1"> {/* InputGroup  */}
  //         <input data-slot="input" placeholder="Input" className="border p-2" /> {/* Input  */}
  //     </div>

  //     <div className="w-200 flex border *:data-[slot=input]:flex-1"> {/* InputGroup  */}
  //       <div   
  //         data-slot="text-field"
  //         className="contents"
  //       >   {/* TextField  */}
  //         <input data-slot="input" placeholder="Input" className="border p-2" /> {/* Input  */}
  //       </div>
  //     </div>
  //   </div>
  // );
}
