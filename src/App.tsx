import { ErrorMessage } from "@hookform/error-message"
import { zodResolver } from "@hookform/resolvers/zod"
import { Github } from "@react-symbols/icons"
import { MoveUpRight, Search } from "lucide-react"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Separator } from "./components/Separator"

interface GithubProfile {
  avatar_url: string
  name: string
  public_repos: string
  created_at: string
  html_url: string
}

const searchUserSchema = z.object({
  user: z.string().nonempty("O nome de usuário é obrigatório"),
})

type SearchUserData = z.infer<typeof searchUserSchema>

export function App() {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<SearchUserData>({
    resolver: zodResolver(searchUserSchema),
  })
  const [profile, setProfile] = useState<GithubProfile | null>(null)

  async function handleSearchUser(data: SearchUserData) {
    try {
      const response = await fetch(`https://api.github.com/users/${data.user}`)
      const json = await response.json()

      if (!response.ok) {
        throw new Error("Usuário não encontrado")
      }

      setProfile(json)
    } catch (error) {
      console.log(error)
    }

    reset()
  }

  return (
    <div className="flex h-screen flex-col gap-64 bg-gray-950 px-32 py-10 text-white">
      <header>
        <div className="font-title flex items-center gap-2 text-xl">
          <Github width={70} height={70} />
          <h1>GitHub Profile</h1>
        </div>
      </header>

      <main className="flex items-center justify-between">
        <div className="flex flex-col gap-5">
          <h1 className="font-subtitle text-7xl font-bold">GitHub Profile</h1>
          <p className="font-text bg-gradient-to-r from-indigo-200 to-indigo-600 bg-clip-text text-lg font-bold text-transparent uppercase">
            Procure seu usuário do GitHub abaixo:
          </p>
          <form
            className="flex items-center gap-2"
            onSubmit={handleSubmit(handleSearchUser)}
          >
            <input
              type="text"
              placeholder="@usuario"
              className="font-text max-w-56 rounded-xl border-2 p-4 outline-0 placeholder:text-gray-400 focus:border-indigo-400"
              {...register("user")}
            />
            <button
              type="submit"
              className="cursor-pointer rounded-xl bg-indigo-100 p-4 text-black outline-0 hover:opacity-80"
            >
              <Search />
            </button>
          </form>

          <ErrorMessage
            errors={errors}
            name="user"
            render={({ message }) => (
              <p className="text-sm text-red-500">{message}</p>
            )}
          />
        </div>

        {profile && (
          <div className="flex items-center gap-24">
            <img
              src={profile.avatar_url}
              alt={`Avatar de ${profile.name}`}
              className="w-[200px] rounded-[9999px] border-2 border-indigo-500"
            />
            <div className="font-text flex flex-col items-center gap-4">
              <div className="flex flex-col items-center gap-2">
                <h2 className="text-2xl font-bold">{profile.name}</h2>

                <p className="text-sm">
                  Total de repositórios: {profile.public_repos}
                </p>
              </div>

              <Separator />

              <div className="flex flex-col items-center gap-2">
                <p>Desde {new Date(profile.created_at).getFullYear()}</p>

                <a
                  target="_blank"
                  href={profile.html_url}
                  className="flex w-[180px] items-center justify-center gap-2 rounded-xl bg-indigo-100 p-4 font-semibold text-black outline-0 hover:opacity-80"
                >
                  Acessar GitHub
                  <MoveUpRight size={16} />
                </a>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
