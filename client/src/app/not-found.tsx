import Link from "next/link";
import { FiShoppingBag, FiHome } from "react-icons/fi";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white px-4">
      <div className="max-w-md text-center">
        <FiShoppingBag className="mx-auto text-6xl text-primary mb-6" />
        <h1 className="text-4xl font-bold mb-4 text-gray-800">
          Oops! Page Not Found
        </h1>
        <p className="text-gray-600 mb-8">
          The page you are looking for doesn&apos;t exist or has been moved.
          Let&apos;s get you back on track!
        </p>

        <Link href="/" passHref>
          <Button
            variant="default"
            size="lg"
            className="flex items-center mx-auto"
          >
            <FiHome className="mr-2 text-lg" />
            Back to Home
          </Button>
        </Link>
      </div>
    </div>
  );
}
