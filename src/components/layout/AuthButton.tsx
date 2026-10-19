import { logOut, signIn, useUser } from '../../auth';

export default function AuthButton() {
  const user = useUser();
  if (user === undefined) return null;

  return (
    <div className="px-4 pt-4 pb-2 text-[13px] text-[#aaa398]">
      {user ? (
        <div className="flex justify-between items-center gap-2">
          <span className="truncate">{user.displayName ?? user.email}</span>
          <button onClick={logOut} className="shrink-0 hover:text-white">
            登出
          </button>
        </div>
      ) : (
        <button onClick={signIn} className="hover:text-white">
          Google 登入
        </button>
      )}
    </div>
  );
}
