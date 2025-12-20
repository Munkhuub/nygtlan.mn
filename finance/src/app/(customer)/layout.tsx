import Header from "./_components/Header";

export default function LaAdminyout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="lg:w-[1440px] m-auto min-h-[100vh]">
      <Header />
      {children}
    </div>
  );
}
