- [ ] Write endpoints: POST/PUT/DELETE for creating, updating, deleting recipes
- [ ] Authentication: Protect write operations with JWT or API keys
- [ ] Image serving: Static file endpoint for recipe images
- [ ] Validation: Library like zod for stricter input validation
- [ ] Tests: Unit/integration tests with Jest or Vitest
- [ ] Database normalization
  - [ ] allergens: Muchos duplicados (traces-of y sin traces-of)
  - [ ] Imágenes: todas las jpeg, cambiarlas por jpg
  - [ ] Ingredients: columna Pantry: corregir
  - [ ] Nuevas imágenes:

- [ ] UI main page: infinite scroll, en lugar de paginación

- [ ] Un layout [así](https://www.bananaprompts.xyz/)

- [ ] Hacer más rápido
  - [ ] ver qué lo hace ir lento
  - [ ] Cache (de backend y/o de frontend?)
  - [ ] quitar animaciones?
- [ ] Poner algún componente chulo?

- [ ] Add Supabase Auth, then:
  - [ ] Users create recipes with their user_id
  - [ ] They can only edit/delete their own recipes
  - [ ] The frontend can use supabase.auth.getUser() to get the authenticated
        user

## Next steps

In the recipes/[slug] page, add the following missing features:

- [x] Imagen de receta: supabase bucket + API (image_url) + frontend
- [x] Imagen de paso: supabase bucket + API (image_url) + frontend
- [x] Alérgenos (por ingrediente) - también falta en la API

- [ ] Imágenes para alérgenos
- [ ] Imágenes para ingredientes
- [ ] Imágenes para utensilios
- [ ] Ingredientes: con checkbox oculto. Al darle, va al final y se queda oscurecido/tachado. Al volverle a dar, vuelve a su sitio original.

- [ ] Rehacer UI (inspiración: https://www.google.com/search?q=modern+recipe+page+ui)
- [x] Sustituir emojis por iconos de verdad. También caracteres como ←
- [ ] Separar pantry ingredients
- [x] Info nutricional, "por 100g"
- [x] Info nutricional, nota: "La información nutricional por comida es aproximada y puede variar dependiendo de los ingredientes exactos que elijas."

- [ ] Ingredientes: input con el número de porciones, la cantidad se ajusta (default is 2). Mín 1, máx 6.
- [ ] Utensilios: con imagen
- [ ] Unificar typescript types de la API y del front, en un paquete común?

In the main page:

- [ ] Rehacer UI (inspiración: https://www.google.com/search?q=modern+recipe+page+ui), ¿con Radix UI?

## Recipe creation UI (future)

With the following fields:

- id (UUID): auto
- slug (string): auto from name and ensuring uniqueness
- created_at (timestamp): auto
- last_updated_at (timestamp): auto

- is_active (boolean): UI
- name (string): UI
- headline (string): UI
- description (string): UI
- has_image (boolean): UI (if image updated)
- time_minutes (int): UI
- difficulty (1|2|3): UI
- nutrition section (numbers): UI
- steps:
  - id (UUID): auto
  - recipe_id (UUID): auto
  - step_order (int): drag-and-drop ordering
  - instructions (text): UI
  - has_image (boolean): UI (if image updated)

- tags: multi-select from existing
- cuisines: multi-select from existing
- utensils: multi-select from existing
- ingredients:
  - name: multi-select from existing
  - quantity_amount: number
  - quantity_unit: multi-select from existing

## Add / remove from favorites (future)

---

- [ ] Rediseñar usando [esto](https://www.unicorn.studio/) ([complete free guide with step-by-step tutorial](https://www.simplifyingai.co))
- [ ] SEO: https://www.instagram.com/reel/DUJYBUmDDXf/?igsh=dnA1Y3gyemM0eHJk no
