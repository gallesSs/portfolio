import { dirname } from "node:path";
import { fileURLToPath } from "node:url";
import type { NextConfig } from "next";

/*  Корень указан явно: выше по дереву лежит чужой package-lock.json, и
    Turbopack принимает домашнюю папку за корень монорепозитория. Локально
    это просто ругательство в консоли, но в трассировку файлов при сборке
    попадает не то, что нужно, — выяснять это на продакшене не хочется.  */

const nextConfig: NextConfig = {
  turbopack: { root: dirname(fileURLToPath(import.meta.url)) },
};

export default nextConfig;
