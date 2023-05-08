import { useState, useEffect } from 'react'

interface Appartment {
  id: number;
  title: string;
  image_url: string;
}

const AppartmentCard = ({title, image_url}:Appartment):JSX.Element => {
  return (
    <div className='w-[350px] rounded-lg shadow-lg bg-gray-200'>
      <img src={image_url} onError={(e) => {e.currentTarget.src = 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d1/Image_not_available.png/800px-Image_not_available.png?20210219185637'}} alt={title} className='w-full h-[200px] object-cover rounded-t-lg' />
      <div className='p-4 text-center'>
        <h3 className='text-xl font-semibold'>{title}</h3>
      </div>
    </div>
  )
};

const App = () => {
  const [appartments, setAppartments] = useState([])
  const [page, setPage] = useState(1)

  useEffect(() => {
    window.scrollTo(0, 0);
    const fetchData = async () => {
      const res = await fetch(`http://localhost:8080/api/appartments?page=${page}`);
      const data = await res.json();      
      setAppartments(data.rows);
    }
    fetchData();
  }, [page])

  const totalPages = Math.ceil(500 / 20);
  return (
    <>
      <div className="flex, justify-center">
        <div className='flex flex-col justify-center items-center gap-6 p-3'>
          <h1 className='text-3xl font-bold p-3 text-gray-300'>APPARTMENTS</h1>
          <p className='text-gray-300'>You are currently viewing appartments {page * 20 - 19} - {page * 20} of 500</p>
        </div>
        <div className='flex flex-wrap justify-center gap-6 p-3'>
          {appartments && appartments.map((appartment: Appartment) => (
            <AppartmentCard key={appartment.id} {...appartment} />
          ))}
        </div>
        <div className='flex justify-center gap-3 p-3'>
          <button onClick={() => setPage(page - 1)} disabled={page === 1} className='bg-gray-300 px-2 rounded-lg'>Previous</button>
          {
            Array.from({length: totalPages}, (_, i) => i + 1).map((p) => (
              <button key={p} onClick={() => setPage(p)} className={`bg-gray-300 p-3 rounded-full h-10 w-10 flex items-center justify-center ${p === page ? 'bg-gray-500' : ''}`}>{p}</button>
            ))
          }
          <button onClick={() => setPage(page + 1)} disabled={page === totalPages} className='bg-gray-300 px-2 rounded-lg'>Next</button>
        </div>
      </div>
      
    </>
  )
}

export default App