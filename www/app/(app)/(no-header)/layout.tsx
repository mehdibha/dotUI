import { Footer } from "@/components/layout/footer";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div>
      <main>{children}</main>
      <Footer />
    </div>
  );
}
