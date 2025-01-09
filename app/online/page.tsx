import Link from 'next/link'

export default function OnlineOptions() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <h1 className="text-4xl font-bold mb-8">オンライン対戦</h1>
      <div className="flex space-x-4">
        <Link href="/online/create" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
          部屋を作成
        </Link>
        <Link href="/online/join" className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded">
          部屋に入室
        </Link>
      </div>
      <Link href="/" className="mt-8 text-blue-500 hover:text-blue-700">
        ホームに戻る
      </Link>
    </div>
  )
}

