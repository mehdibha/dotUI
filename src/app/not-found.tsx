import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="mt-32 flex flex-col items-center space-x-4">
      <h1 className="text-4xl dark:text-white">404</h1>
      <p className="text-lg text-stone-500 dark:text-stone-400">
        Cette page n&apos;existe pas
      </p>
      <Button color="primary" className="mt-4">
        Retour à l&apos;accueil
      </Button>
    </div>
  );
}
