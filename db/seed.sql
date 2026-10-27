-- Administradores autorizados
INSERT OR IGNORE INTO admins (email, name, role) VALUES
  ('niquitao83@gmail.com', 'Ali Marcarella Gómez', 'admin'),
  ('jolex3630@gmail.com', 'Joel', 'admin');

-- Catálogo fotográfico base
INSERT OR IGNORE INTO photos (id, title, category, alt, src, width, height, sort_order, is_active) VALUES
  ('arbol', 'Atardecer sobre el agua', 'bodas', 'Atardecer con un árbol en silueta sobre el agua y un sol naranja entre las nubes', '/assets/photos/arbol.webp', 1280, 1600, 1, 1),
  ('video-manuel-gual', 'Buque Manuel Gual', 'video', 'Fotograma del video del buque Manuel Gual en el muelle', '/assets/photos/video-manuel-gual.webp', 640, 360, 2, 1),
  ('cojedes6', 'Primer sol', 'bodas', 'Amanecer sobre montañas con neblina y el sol bajo en el horizonte', '/assets/photos/cojedes6.webp', 2200, 1467, 3, 1),
  ('copey', 'Mirando el valle', 'retratos', 'Mujer de espaldas mirando un valle cubierto de nubes al atardecer', '/assets/photos/copey.webp', 1067, 1600, 4, 1),
  ('cruz4', 'Cruz al atardecer', 'bodas', 'Cruz iluminada en una colina bajo un cielo naranja, con la ciudad a oscuras debajo', '/assets/photos/cruz4.webp', 1600, 1280, 5, 1),
  ('vigirima10', 'En la cima', 'eventos', 'Excursionista de pie sobre una roca, con montañas y el mar al fondo', '/assets/photos/vigirima10.webp', 1280, 1600, 6, 1),
  ('montalban', 'Neblina', 'eventos', 'Valle con neblina y cerros a contraluz al amanecer', '/assets/photos/montalban.webp', 2200, 1238, 7, 1),
  ('dionisio', 'Sobre la roca', 'retratos', 'Silueta de una persona sobre una roca frente a un mar de nubes', '/assets/photos/dionisio.webp', 759, 1350, 8, 1),
  ('kairoy15', 'Hora azul', 'bodas', 'Hora azul con un resplandor naranja en el horizonte y las luces de una ciudad', '/assets/photos/kairoy15.webp', 2200, 1467, 9, 1),
  ('juancho', 'Laguna de montaña', 'eventos', 'Persona con chaqueta amarilla sobre una roca junto a una laguna de montaña', '/assets/photos/juancho.webp', 759, 1350, 10, 1),
  ('naiguata3', 'Sobre las nubes', 'eventos', 'Sol entre nubes naranjas sobre un mar de nubes oscuras', '/assets/photos/naiguata3.webp', 1238, 2200, 11, 1),
  ('catcher', 'Receptor', 'corp', 'Receptor de béisbol con máscara y protecciones lanzando la pelota frente a una pared oscura', '/assets/photos/catcher.webp', 1280, 1600, 12, 1),
  ('cojedes2', 'El último naranja', 'bodas', 'Sol poniéndose entre capas de montañas azuladas', '/assets/photos/cojedes2.webp', 1467, 2200, 13, 1),
  ('guacamaya', 'Dentro de la cueva', 'eventos', 'Persona dentro de una cueva de formaciones rocosas, con un rayo de luz que entra desde arriba', '/assets/photos/guacamaya.webp', 900, 1600, 14, 1),
  ('cruz6', 'Noche', 'bodas', 'Cruz iluminada sobre una colina con las luces de la ciudad al anochecer', '/assets/photos/cruz6.webp', 2200, 1760, 15, 1),
  ('maco', 'Fotógrafo en ruta', 'retratos', 'Fotógrafo con mochila y cámara, de perfil, con montañas al fondo', '/assets/photos/maco.webp', 900, 1600, 16, 1),
  ('kairoy5', 'Cumbres', 'corp', 'Colinas verdes con una cruz y una antena al atardecer', '/assets/photos/kairoy5.webp', 1760, 2200, 17, 1),
  ('red', 'La red', 'producto', 'Silueta de una persona lanzando una red de pesca sobre el agua al atardecer', '/assets/photos/red.webp', 1280, 1600, 18, 1),
  ('naiguata1', 'La escala humana', 'retratos', 'Silueta de un fotógrafo sobre una cima, frente a un mar de nubes al atardecer', '/assets/photos/naiguata1.webp', 1237, 2200, 19, 1),
  ('cumbre', 'Cumbre y nubes', 'corp', 'Montañas en silueta sobre un mar de nubes, con una figura diminuta en la cumbre', '/assets/photos/cumbre.webp', 1080, 607, 20, 1),
  ('vigirima26', 'Subiendo', 'eventos', 'Excursionista subiendo una montaña de laderas verdes', '/assets/photos/vigirima26.webp', 1080, 1350, 21, 1),
  ('cruzsol', 'Contraluz', 'producto', 'Cruz metálica a contraluz con el sol y nubes al fondo', '/assets/photos/cruzsol.webp', 1238, 2200, 22, 1),
  ('solo9', 'Hacia arriba', 'retratos', 'Hombre haciendo una dominada desde abajo, entre árboles altos que apuntan al cielo', '/assets/photos/solo9.webp', 759, 1350, 23, 1),
  ('codazzi', 'Entre la niebla', 'retratos', 'Hombre con chaqueta entre la vegetación y la neblina', '/assets/photos/codazzi.webp', 1066, 1600, 24, 1),
  ('kairoy1', 'Silueta al atardecer', 'retratos', 'Silueta de un hombre de pie frente al horizonte naranja del atardecer', '/assets/photos/kairoy1.webp', 1280, 1600, 25, 1);
