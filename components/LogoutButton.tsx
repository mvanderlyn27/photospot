import { logout } from '@/app/serverActions/auth/logout';
export default function LogoutButton() {
  return (
    <form action={logout} method="post">
      <button className="py-2 px-4 rounded-md no-underline bg-btn-background hover:bg-btn-background-hover">
        Logout
      </button>
    </form>
  )
}
