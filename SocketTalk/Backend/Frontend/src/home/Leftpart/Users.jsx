import React from "react";
import User from "./User";
import useGetAllUsers from "../../context/useGetAllUsers";

function Users() {
  const [allUsers, loading] = useGetAllUsers();
  // console.log(allUsers);
  return (
    <div>
      <h1 className="px-4 py-2 text-white font-semibold bg-slate-900 rounded-md">
        Messages
      </h1>
      <div
        className="mt-2 flex-1 overflow-y-auto border-t"
        style={{ maxHeight: "calc(84vh - 10vh)" }}
      >
        {allUsers.map((user, index) => (
          <User key={index} user={user} />
        ))}
      </div>
    </div>
  );
}

export default Users;
