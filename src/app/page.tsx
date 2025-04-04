import Logo from "@/components/assets/Logo"
import BreadcrumbUpdater from "@/components/ui/breadcrumb-updater"
import { Hina_Mincho } from "next/font/google"

const hinaMincho = Hina_Mincho({
  weight: "400",
  subsets: ["latin"],
})

export default async function Home() {
  return (
    <>
      <BreadcrumbUpdater items={[{ label: "Home" }]} />
      <div className="flex flex-col items-center justify-center w-full grow p-4">
        <Logo className="w-36 aspect-square" />
        <h1 className={`${hinaMincho.className} text-4xl`}>Owari.</h1>
        <h2 className={`${hinaMincho.className} text-xl mb-4`}>
          end, conclusion, finish
        </h2>
        <p className="text-center mb-2">
          This task manager app helps you complete tasks, ensuring nothing is
          left unfinished.
        </p>
      </div>
    </>
  )
}
