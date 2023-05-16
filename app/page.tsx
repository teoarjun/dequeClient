import SearchBar from '@/components/SearchBar'

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center p-24">
      <div className="">
        <p>
          Welcome to Search App
        </p>
      </div>
      <div className="py-9">        
        <SearchBar />
      </div>

    </main>
  )
}
