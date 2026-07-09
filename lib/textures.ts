import * as THREE from "three";

/*  Текстуры рисуются на канвасе один раз при монтировании сцены.
    Так узор есть, а по сети не едет ни одного килобайта картинок.  */

const px = (n: number) => {
  const c = document.createElement("canvas");
  c.width = c.height = n;
  return c;
};

/** Зерно: без него любая процедурная поверхность выглядит пластиковой. */
function grain(ctx: CanvasRenderingContext2D, size: number, amount: number) {
  const img = ctx.getImageData(0, 0, size, size);
  for (let i = 0; i < img.data.length; i += 4) {
    const n = (Math.random() - 0.5) * amount;
    img.data[i] += n;
    img.data[i + 1] += n;
    img.data[i + 2] += n;
  }
  ctx.putImageData(img, 0, 0);
}

/** Стена: вертикальные панели с фаской, снизу тень плинтуса. */
export function wallTexture(): THREE.CanvasTexture {
  const S = 512;
  const c = px(S);
  const ctx = c.getContext("2d")!;

  ctx.fillStyle = "#1a1e26";
  ctx.fillRect(0, 0, S, S);

  const panels = 4;
  const w = S / panels;
  for (let i = 0; i < panels; i++) {
    const x = i * w;
    const g = ctx.createLinearGradient(x, 0, x + w, 0);
    g.addColorStop(0, "#20242d");
    g.addColorStop(0.5, "#1a1e26");
    g.addColorStop(1, "#14171e");
    ctx.fillStyle = g;
    ctx.fillRect(x + 2, 0, w - 4, S);

    ctx.fillStyle = "#0c0e13"; // шов между панелями
    ctx.fillRect(x, 0, 2, S);
  }

  grain(ctx, S, 26);

  const tex = new THREE.CanvasTexture(c);
  tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = 8;
  return tex;
}

/** Карта неровностей для стен — тот же узор, но в яркости. */
export function wallBump(): THREE.CanvasTexture {
  const S = 256;
  const c = px(S);
  const ctx = c.getContext("2d")!;
  ctx.fillStyle = "#808080";
  ctx.fillRect(0, 0, S, S);

  const panels = 4;
  const w = S / panels;
  for (let i = 0; i < panels; i++) {
    ctx.fillStyle = "#000";
    ctx.fillRect(i * w, 0, 2, S);
  }
  grain(ctx, S, 40);

  const tex = new THREE.CanvasTexture(c);
  tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
  return tex;
}

/** Пол: тёмный бетон в плитах. */
export function floorTexture(): THREE.CanvasTexture {
  const S = 512;
  const c = px(S);
  const ctx = c.getContext("2d")!;

  ctx.fillStyle = "#0f1218";
  ctx.fillRect(0, 0, S, S);

  // пятна затёртости
  for (let i = 0; i < 60; i++) {
    const r = 20 + Math.random() * 90;
    const g = ctx.createRadialGradient(
      Math.random() * S,
      Math.random() * S,
      0,
      Math.random() * S,
      Math.random() * S,
      r,
    );
    g.addColorStop(0, "rgba(30,36,46,0.35)");
    g.addColorStop(1, "rgba(30,36,46,0)");
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, S, S);
  }

  ctx.strokeStyle = "#080a0e";
  ctx.lineWidth = 3;
  ctx.strokeRect(0, 0, S, S);

  grain(ctx, S, 18);

  const tex = new THREE.CanvasTexture(c);
  tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = 8;
  return tex;
}
