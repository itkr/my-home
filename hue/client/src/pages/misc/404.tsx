import { BaseLayout } from "@/components/BaseLayout";

export default function NotFound() {
  console.error("404", "(Not Found)");
  return <BaseLayout title="404">Not Found</BaseLayout>;
}
