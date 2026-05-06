import Image from "next/image";

export function PhotoStrip({
  src,
  alt = "",
  height = "default",
}: {
  src: string;
  alt?: string;
  height?: "default" | "tall";
}) {
  const h = height === "tall"
    ? "h-[280px] sm:h-[360px] md:h-[480px] lg:h-[560px]"
    : "h-[250px] sm:h-[320px] md:h-[400px]";
  return (
    <section className={`relative w-full ${h} overflow-hidden`}>
      <Image
        src={src}
        alt={alt}
        fill
        sizes="100vw"
        className="object-cover"
      />
      <div className="absolute inset-0 grain pointer-events-none" aria-hidden />
    </section>
  );
}
