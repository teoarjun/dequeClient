import SearchBar from '@/components/SearchBar'

export default function Home() {
  return (
    <main className="h-full">
      <div className="text-center mt-5">
        <p className='text-3xl'>
          Welcome to Search App
        </p>
      </div>
      <div className="py-9 pl-12 pr-12">        
        <SearchBar />
      </div>

    </main>
  )
}
