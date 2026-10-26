export const BlogService = {
  getBlogs: () => [
    { id: 1, titulo: "Nuestra historia de 50 años", resumen: "Desde nuestro Record Guinness en 1995 hasta la repostería artesanal moderna.", contenido: "En 1995 logramos el Record Guinness de la torta más grande. Hoy mantenemos viva la receta tradicional con los mejores ingredientes y el talento de jóvenes estudiantes de repostería." },
    { id: 2, titulo: "Secretos de la repostería tradicional", resumen: "Técnicas de horneado, manjar casero y texturas de bizcocho.", contenido: "El verdadero secreto de nuestras tortas radica en la elaboración lenta del manjar casero y la selección de nueces frescas." }
  ],
  getBlogById: (id) => BlogService.getBlogs().find(b => b.id === Number(id))
};
