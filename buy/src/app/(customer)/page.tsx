"use client";
import AdminProfile from "./_components/AdminProfile";
import Transactions from "./_components/Transactions";
import SideBar from "./_components/SideBar";

export default function Home() {
  return (
    <div className="w-full flex">
      <SideBar />

      <div className="flex flex-col gap-8 pt-11 w-full px-8 md:px-20">
        <AdminProfile />
        <Transactions />
      </div>
    </div>
  );
}
