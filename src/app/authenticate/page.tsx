import dynamic from "next/dynamic";

const Authenticate = dynamic(() => import("@/components/Authenticate"), {
  ssr: false,
});

export default function AuthenticatePage() {
  return <Authenticate />;
}
