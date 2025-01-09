
import Link from 'next/link'

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2">
      <h1 className="text-6xl font-bold mb-8">Quantum Go-moku</h1>
      <div className="flex space-x-4">
        <Link href="/local" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
          Local Game
        </Link>
        <Link href="/online" className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded">
          Online Game
        </Link>
      </div>
    </div>
  )
}
