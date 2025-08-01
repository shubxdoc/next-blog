import { Loader2 } from "lucide-react";

export default function FullScreenLoader() {
  return (
    <div className="flex justify-center items-center h-screen">
      <Loader2 className="animate-spin w-6 h-6" />
    </div>
  );
}
