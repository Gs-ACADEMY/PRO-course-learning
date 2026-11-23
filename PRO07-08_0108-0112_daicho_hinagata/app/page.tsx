import { redirect } from "next/navigation";

// / は /projects に移すだけ
export default function Home() {
  redirect("/projects");
}
