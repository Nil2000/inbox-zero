import { Footer } from "@/app/(landing)/home/Footer";
import { Header } from "@/app/(landing)/home/Header";

export function BlogLayout(props: { children: React.ReactNode }) {
  return (
    <div className="bg-white">
      <div className="sticky inset-x-0 top-0 z-30 w-full transition-all">
        <Header className="bg-white/75 shadow backdrop-blur-md" />
      </div>
      <main className="isolate">{props.children}</main>
      <Footer />
    </div>
  );
}