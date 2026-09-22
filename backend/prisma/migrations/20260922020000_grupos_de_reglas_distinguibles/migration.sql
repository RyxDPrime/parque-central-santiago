-- Distingue el apartado de las reglas de un espacio del de un tramite.
--
-- Al elegir el Kiosco del Area Infantil con el tramite "Alquiler de kiosco",
-- el formulario mostraba dos apartados seguidos: "Reglas de este kiosco" y
-- "Reglas del kiosco". Son cosas distintas -uno es de ese kiosco en concreto,
-- el otro de todos- pero leidos uno debajo del otro parecen un error de
-- duplicado, y la diferencia que importa se pierde.
--
-- Las reglas de un espacio pasan a un apartado que nombra lo que son. En la
-- pagina de Condiciones ya va precedido del nombre del espacio, asi que no
-- hace falta repetirlo.

UPDATE "ReglaUso" SET "grupo" = 'Propio de este espacio' WHERE "ambito" = 'espacio';
