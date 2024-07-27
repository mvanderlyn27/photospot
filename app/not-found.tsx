import Link from "next/link";

export default function NotFound() {
  return (
    <div>
      <h2>Uh Oh :(</h2>
      <p>
        Looks like this page doesn't exist, lets go back to where its safe:{" "}
      </p>
      <Link href="/" className="text-primary hover:underline">
        Return Home
      </Link>
    </div>
  );
}
