import MyAccount from "./myAccount";
import MyProfile from "./myProfile";

export default function SettingSection({ user }: { user: any }) {
    return (
        <div className="flex flex-col items-center gap-8">
            <MyProfile user={user} />
            <MyAccount user={user} />
        </div>
    )
}