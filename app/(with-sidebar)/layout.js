import Navigation from "@/components/navigation/navigation";

export default function RootLayout({ children }) {
  return (
    <>
        <Navigation />
        {children}
    </>
  );
}
