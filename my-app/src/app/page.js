'use client';
export default function Home() {
  const handleClick = async() => {
  let data={name:"John", age:25};
   let a=  await fetch("/api/add",
    {method:'POST',
      headers:{
      'Content-Type':'application/json'
      },
      body:JSON.stringify(data),
    })
    let res= await a.json();
    console.log(res);
   
  };
  return (
    <>
     <div>
      <h1 className="bg-amber-600">Home</h1>
     </div>
     <button onClick={handleClick}> Click ME</button>
     </>
  );
}