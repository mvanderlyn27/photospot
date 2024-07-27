"use client"
import { Button } from '../ui/button';
import useSWRMutation from 'swr/mutation';
import { useSWRConfig } from 'swr';
import { useRouter } from 'next/navigation';
export default function LogoutButton() {
  const { mutate } = useSWRConfig();
  const router = useRouter();
  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    await mutate('/api/profile', null);
    router.push('/');
    router.refresh();
  }
  const { trigger: logout } = useSWRMutation("/api/auth/logout", handleLogout);
  return (
    <Button variant="outline" onClick={() => logout()}>
      Logout
    </Button>
  )
}
