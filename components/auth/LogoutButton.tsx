import { logout } from '@/app/serverActions/auth/logout';
import { Button } from '../ui/button';
export default function LogoutButton() {
  return (
    <form action={logout} method="post">
      <Button variant="outline">
        Logout
      </Button>
    </form>
  )
}
