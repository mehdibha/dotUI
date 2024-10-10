import { Footer } from "@/components/footer";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div>
      {children}
      <Footer />
    </div>
  );
}
